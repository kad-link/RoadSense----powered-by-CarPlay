import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { toPng } from 'html-to-image';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';


const DrowsinessDetector = () => {

  const {user, token} =useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertDuration, setAlertDuration] = useState(0);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [logs, setLogs] = useState([]);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const intervalRef = useRef(null);
  const resultCardRef = useRef(null);

  

  const [totalDrivingTime, setTotalDrivingTime] = useState(0);
  const [warningTime, setWarningTime] = useState(0);
  const [asleepTime, setAsleepTime] = useState(0);
  const [showTripSummary, setShowTripSummary] = useState(false);
  const [tripScore, setTripScore] = useState(null);
  const [tripStats, setTripStats]=useState(null);
  const startTimeRef = useRef(null);
  const lastStateRef = useRef('normal');
  const stateStartTimeRef = useRef(null);


  const calculateDrivingScore = (totalTime, warnTime, sleepTime) => {
    if (totalTime <= 0) return 100;
    
    const alpha = 1.5;
    const beta = 4;
    
    const penalty = (alpha * warnTime + beta * sleepTime) * 5;
    const score = Math.max(0, 100 - penalty);
    
    return Math.round(score * 100) / 100;
  };

  const fetchScoreHistory = async () => {
    setLoadingScores(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/score/${user.email}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  
      },

      });
      const data = await response.json();
      
      if (data.success) {
        setScoreHistory(data.scores || []);
      }
    } catch (error) {
      console.error('Failed to fetch score history:', error);
    } finally {
      setLoadingScores(false);
    }
  };

  


  const downloadScreenshot = async () => {
  if (!resultCardRef.current) return;
  
  try {
    const dataUrl = await toPng(resultCardRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#000000'
    });
    
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `driving-report-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  }
};

  
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const now = Date.now();
      
      if (startTimeRef.current) {
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        setTotalDrivingTime(elapsedSeconds);
      }

      if (stateStartTimeRef.current && lastStateRef.current) {
        if (lastStateRef.current === 'warning') {
          setWarningTime(prev => prev + 1);
        } else if (lastStateRef.current === 'asleep') {
          setAsleepTime(prev => prev + 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const updateDrivingState = (classes, isAlert) => {
    const now = Date.now();
    
    let newState = 'normal';
    if (isAlert || classes.includes('asleep') || classes.includes('sleeping')) {
      newState = 'asleep';
    } else if (classes.includes('drowsy') || classes.includes('yawning')) {
      newState = 'warning';
    }

    if (newState !== lastStateRef.current) {
      lastStateRef.current = newState;
      stateStartTimeRef.current = now;
    }
  };

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_DETECTION_API_URL;
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to drowsiness detection server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('status', (data) => {
      console.log('Server status:', data);
    });

    newSocket.on('detection_result', (data) => {
      setAnnotatedImage(data.image);
      setDetectedClasses(data.detected_classes);
      setAlert(data.alert);
      setAlertDuration(data.alert_duration || 0);
      
      updateDrivingState(data.detected_classes, data.alert);
      
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        classes: data.detected_classes,
        alert: data.alert,
        duration: data.alert_duration || 0
      };
      
      setLogs(prevLogs => {
        const newLogs = [logEntry, ...prevLogs];
        return newLogs.slice(0, 10);
      });
      
      if (data.alert) {
        playAlertSound();
      }
    });

    newSocket.on('error', (error) => {
      console.error('Detection error:', error);
      alert('Error: ' + error.message);
    });

    return () => {
      newSocket.close();
      stopDetection();
    };
  }, []);

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        
        startTimeRef.current = Date.now();
        stateStartTimeRef.current = Date.now();
        lastStateRef.current = 'normal';
        setTotalDrivingTime(0);
        setWarningTime(0);
        setAsleepTime(0);
        setShowTripSummary(false);
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          
          intervalRef.current = setInterval(() => {
            captureAndSendFrame();
          }, 100);
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please grant camera permission and try again.');
    }
  };

  const stopDetection = async() => {

    if (isActive && totalDrivingTime > 0) {
      const finalScore = calculateDrivingScore(totalDrivingTime, warningTime, asleepTime);
      
      
      
      setTripScore(finalScore);
      setTripStats({
        totalTime: totalDrivingTime,
        warningTime: warningTime,
        asleepTime: asleepTime,
         });

         try {

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/score/${user.email}`, {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer: ${token}`
          },
          body: JSON.stringify({
            score : finalScore,
        })
      })
      

      const data = await response.json();

        console.log(data.message);
      
    } catch (error) {
      console.error('Score saving failed :', error);
      alert('Internal Server Error. Please try again later.');
    }
      
      setShowTripSummary(true);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsActive(false);
    setDetectedClasses([]);
    setAlert(false);
    setAlertDuration(0);
    
    startTimeRef.current = null;
    stateStartTimeRef.current = null;
    lastStateRef.current = 'normal';

    setTimeout(() => {
      setAnnotatedImage(null);
      setLogs([]);
    }, 0);
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current || !canvasRef.current || !socket || !socket.connected) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      socket.emit('frame', { image: imageData });
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  const getStatusColor = () => {
    if (!isActive) return '#6c757d';
    if (alert) return '#dc3545';
    if (detectedClasses.includes('drowsy')) return '#ffc107';
    return '#28a745';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'Well Driven';
    else return "Every day is not a Sunday. Drive Carefully . . ."
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  useEffect(()=>{
    if (!user || !user.email) return;
    if(!isActive)fetchScoreHistory();

  },[isActive, user])
  return (
    <>
    
    <div className="max-w-full mx-auto p-5 bg-gray-900">
      <Navbar />
      <h2 className="text-6xl font-light tracking-tighter mb-5 text-white">
        Drive Safe
      </h2>
      
      <div className={`mb-4 p-2 rounded ${
        connectionStatus === 'connected' 
          ? 'text-green-400' 
          : 'text-red-400'
      } bg-gray-700 w-fit border border-white`}>
        <strong className='text-white'>Server Status:</strong> {connectionStatus === 'connected' ? 'Good to Go' : 'Eww.. Retry'}
      </div>

      <div className='flex flex-row gap-x-15'>
        <div className="w-200 h-150 bg-gray-700 rounded-lg overflow-hidden mb-5 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {annotatedImage ? (
            <img 
              src={annotatedImage} 
              alt="Detection Feed" 
              className="w-200 h-150 block"
            />
          ) : (
            <div className="w-200 h-150 flex items-center justify-center bg-gray-900 text-gray-500 border border-dotted">
              <div className="text-center">
                <p>You will appear here</p>
                <p className="text-sm">Click "Start Detection" to begin</p>
              </div>
            </div>
          )}
          
          {alert && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-600/95 text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg z-10 animate-pulse">
              ⚠️ DROWSINESS ALERT!
              <div className="text-sm mt-1">
                Duration: {alertDuration}s
              </div>
            </div>
          )}

          {isActive && (
            <div 
              className="absolute top-2 right-2 text-white px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: getStatusColor() }}
            >
              ● {alert ? 'ALERT' : detectedClasses.includes('drowsy') ? 'DROWSY' : 'NORMAL'}
            </div>
          )}
        </div>

        <div className="mt-5 bg-gray-900 p-5 rounded-lg border border-gray-200 flex-shrink-0 w-96">
          <h3 className="mt-0 mb-4 text-lg font-semibold text-white">
            Your recent driving forms:
          </h3>

          
          {isActive ? (
            logs.length > 0 ? (
              <>
                <div className="max-h-125 overflow-y-auto bg-white rounded border border-gray-200">
                  {logs.map((log, index) => (
                    <div
                      key={log.id}
                      className={`p-3 flex justify-between items-center transition-colors ${
                        index < logs.length - 1 ? 'border-b border-gray-200' : ''
                      } ${log.alert ? 'bg-yellow-50' : 'bg-white'}`}
                    >
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">{log.timestamp}</div>
                        <div className={`text-sm text-gray-900 ${log.alert ? 'font-bold' : ''}`}>
                          {log.alert && '⚠️ '}
                          {log.classes.length > 0 ? (
                            <>
                              <strong>Detected:</strong> {log.classes.join(', ')}
                              {log.alert && ` (${log.duration}s)`}
                            </>
                          ) : (
                            <span className="text-green-600">✓ Normal - No drowsiness detected</span>
                          )}
                        </div>
                      </div>
                      <div>
                        {log.alert ? (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">ALERT</span>
                        ) : log.classes.includes('drowsy') ? (
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">WARNING</span>
                        ) : (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">NORMAL</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Showing last {logs.length} detection{logs.length !== 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 bg-white rounded-lg p-6 border border-dashed border-gray-300">
                <p className="text-lg font-medium">No detections yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start the detection to see your recent driving activity.
                </p>
              </div>
            )
          ) : (
            loadingScores ? (
              <div className="text-center text-white bg-gray-800 rounded-lg p-6">
                <p className="text-lg">Loading scores...</p>
              </div>
            ) : scoreHistory.length > 0 ? (
              <>
                <div className="max-h-125 overflow-y-auto bg-white rounded border border-gray-200">
                  {scoreHistory.map((scoreEntry, index) => (
                    <div
                      key={scoreEntry._id || index}
                      className={`p-3 transition-colors ${
                        index < scoreHistory.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            {formatDate(scoreEntry.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getScoreColor(Number(scoreEntry.score))}`}>
                              {Number(scoreEntry.score).toFixed(1)}%
                            </span>
                            {scoreEntry.score >= 90 ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                Excellent
                              </span>
                            ) : scoreEntry.score >= 70 ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                                Good
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                                Needs Improvement
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Showing {scoreHistory.length} past trip{scoreHistory.length !== 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 bg-white rounded-lg p-6 border border-dashed border-gray-300">
                <p className="text-lg font-medium">No past trips</p>
                <p className="text-sm text-gray-400 mt-1">
                  Complete your first trip to see your score history.
                </p>
              </div>
            )
          )}
        </div>
      </div>
      <div className="text-center mb-5">
        <button 
          onClick={isActive ? stopDetection : startDetection}
          disabled={connectionStatus !== 'connected'}
          className={`px-8 py-3 text-base rounded-lg border-none font-bold transition-all cursor-pointer ${
            connectionStatus !== 'connected' 
              ? 'bg-gray-500 cursor-not-allowed' 
              : isActive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {isActive ? '⏹ Stop Detection' : '▶ Start Detection'}
        </button>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="mt-0 mb-4 text-lg font-semibold">SESSION STATUS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={`w-fit rounded-sm p-2 border-3 border-black border-outline cursor-default font-bold mt-1 
              ${isActive ? 'text-green-500 bg-black' : 'text-gray-500 bg-yellow-400'}`}>
            {isActive ? '🔴 LIVE' : '⚫ DORMANT'}
          </div>
          
          <div>
            <strong>Detected States:</strong>
            <div className="mt-1 text-gray-700">
              {detectedClasses.length > 0 ? detectedClasses.join(', ') : 'None'}
            </div>
          </div>

          {isActive && (
            <>
              <div>
                <strong>Trip Duration:</strong>
                <div className="mt-1 text-gray-700 font-mono text-lg">
                  {formatTime(totalDrivingTime)}
                </div>
              </div>
            </>
          )}
        </div>
        
        {alert && (
          <div className="mt-4 p-3 bg-red-900 rounded text-red-100 font-bold w-fit">
            ⚠️ Alert Active - You are showing signs of drowsiness for {alertDuration}s
          </div>
        )}
      </div>

      {showTripSummary && tripScore !== null && tripStats && (
        <>
        <div ref={resultCardRef}  className='result-card m-3  border-2 border-white rounded-lg shadow-2xl'>
          <div className='p-6'>
            <h1 className='text-white text-5xl font-extralight tracking-tighter mb-2'>
              TRIP COMPLETED
            </h1>
            <p className='tracking-wide text-green-200 text-lg'>Your driving performance summary</p>
          </div>

          <div className='px-6 pb-8'>
            <div className={`text-9xl font-extralight ${getScoreColor(tripScore)} transition-all`}>
              <h1>{tripScore.toFixed(1)}%</h1>
            </div>
            
            <div className='text-white text-2xl font-semibold mb-6'>
              {getScoreGrade(tripScore)}
            </div>

            <div className='bg-black/30 rounded-lg p-5 text-white'>
              <h3 className='text-xl font-semibold mb-4 text-green-300'>Trip Statistics</h3>
              
              <div className='grid grid-cols-3 gap-4 mb-4'>
                <div className='bg-white/10 rounded p-3'>
                  <p className='text-sm text-green-200'>Total Time</p>
                  <p className='text-2xl font-bold'>{formatTime(tripStats.totalTime)}</p>
                </div>
                
                <div className='bg-yellow-500/20 rounded p-3'>
                  <p className='text-sm text-yellow-200'>Warning Time</p>
                  <p className='text-2xl font-bold text-yellow-300'>{formatTime(tripStats.warningTime)}</p>
                </div>
                
                <div className='bg-red-500/20 rounded p-3'>
                  <p className='text-sm text-red-200'>Asleep Time</p>
                  <p className='text-2xl font-bold text-red-300'>{formatTime(tripStats.asleepTime)}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className="flex justify-center">
          <button onClick={downloadScreenshot}
          style={{
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(255, 255, 255)'
              }}
          className='relative overflow-hidden font-bold tracking-tighter mt-5 cursor-pointer rounded-md
    text-white border border-white p-2
    before:absolute before:inset-0 before:bg-white before:translate-x-[-100%]
    before:transition-transform before:duration-500 before:ease-out
    hover:before:translate-x-0 hover:text-black
    before:z-0 z-10'>
      <span className="relative z-10">Generate Report</span>
      </button>
        </div>
        </>
      )}

      {!showTripSummary && (
        <div className='m-3 bg-gray-800 border-2 border-gray-600 rounded-lg p-6'>
          <div className='text-center text-gray-400'>
            <h1 className='text-white text-4xl font-extralight tracking-tighter mb-2'>
              DRIVING SCORE
            </h1>
            <p className='tracking-wide text-lg'>
              {isActive 
                ? 'Trip in progress... Score will be calculated when you stop.' 
                : 'Start a trip to see your driving score'}
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DrowsinessDetector;