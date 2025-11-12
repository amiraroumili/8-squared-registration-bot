import React, { useState, useEffect } from 'react';
import { Send, Users, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import * as XLSX from 'xlsx';
import logo3d from './assets/logo3d.png';
import logoNo from './assets/logo_no.png';
import { questions } from './questions';

const ChessRegistrationBot = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Welcome to the 8-Squared Club! I'm here to help you register. Let's get started!" },
    { type: 'bot', text: "What is your first name?" }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [validationError, setValidationError] = useState('');


  const saveToFile = async (data) => {
    const timestamp = new Date().toISOString();
    
    // Format the data for Google Sheets (convert arrays to strings)
    const formattedData = {};
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        formattedData[key] = data[key].join(', ');
      } else {
        formattedData[key] = data[key] || '';
      }
    });
    
    const newEntry = {
      Timestamp: timestamp,
      'First Name': formattedData.first_name || '',
      'Last Name': formattedData.last_name || '',
      'Email': formattedData.email || '',
      'Phone Number': formattedData.phone_number || '',
      'School': formattedData.school || '',
      'School (Other)': formattedData.school_other || '',
      'Department Choice': formattedData.department_choice || '',
      'Primary Department': formattedData.primary_department || '',
      'Secondary Department': formattedData.secondary_department || '',
      'Motivation': formattedData.motivation || '',
      'Chess Level': formattedData.chess_level || '',
      'Chess.com Username': formattedData.chess_username || '',
      'Online ELO': formattedData.online_elo || '',
      'FIDE Rating': formattedData.fide_rating || '',
      'Official Tournaments': formattedData.official_tournaments || '',
      'Tournament Names': formattedData.tournament_names || '',
      'Favorite Piece': formattedData.favorite_piece || '',
      'Availability': formattedData.availability || '',
      'Feedback': formattedData.feedback || ''
    };

    // Save to localStorage as backup
    let existingData = [];
    try {
      const storedData = localStorage.getItem('8squared_registrations');
      if (storedData) {
        existingData = JSON.parse(storedData);
      }
      existingData.push(newEntry);
      localStorage.setItem('8squared_registrations', JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Send to Google Sheets
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWURyN1hJeUS-s4axDrNuqu_gnnw1u-KSA4vgQdrmgtYBV258It8LlRbNNgCaa4B4H/exec';
    
    try {
      console.log('Sending data to Google Sheets:', formattedData);
      
      // Create form data with individual fields
      const formData = new FormData();
      formData.append('first_name', formattedData.first_name || '');
      formData.append('last_name', formattedData.last_name || '');
      formData.append('email', formattedData.email || '');
      formData.append('phone_number', formattedData.phone_number || '');
      formData.append('school', formattedData.school || '');
      formData.append('school_other', formattedData.school_other || '');
      formData.append('department_choice', formattedData.department_choice || '');
      formData.append('primary_department', formattedData.primary_department || '');
      formData.append('secondary_department', formattedData.secondary_department || '');
      formData.append('motivation', formattedData.motivation || '');
      formData.append('chess_level', formattedData.chess_level || '');
      formData.append('chess_username', formattedData.chess_username || '');
      formData.append('online_elo', formattedData.online_elo || '');
      formData.append('fide_rating', formattedData.fide_rating || '');
      formData.append('official_tournaments', formattedData.official_tournaments || '');
      formData.append('tournament_names', formattedData.tournament_names || '');
      formData.append('favorite_piece', formattedData.favorite_piece || '');
      formData.append('availability', formattedData.availability || '');
      formData.append('feedback', formattedData.feedback || '');
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.text();
      console.log('Google Sheets response:', result);
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
    }

    // Optional: Uncomment below to also download a local Excel file
    /*
    const worksheet = XLSX.utils.json_to_sheet(existingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    const maxWidth = 30;
    const colWidths = Object.keys(newEntry).map(key => ({
      wch: Math.min(Math.max(key.length, 10), maxWidth)
    }));
    worksheet['!cols'] = colWidths;
    XLSX.writeFile(workbook, '8squared_registrations.xlsx');
    */
  };

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text }]);
      setIsTyping(false);
    }, 800);
  };

  const shouldSkipQuestion = (questionIndex, responses = userResponses) => {
    const q = questions[questionIndex];
    if (!q.conditionalOn) return false;
    
    const { field, value, valueIncludes } = q.conditionalOn;
    const userValue = responses[field];
    
    if (valueIncludes) {
      return !userValue || !userValue.includes(valueIncludes);
    }
    
    // Handle array of acceptable values
    if (Array.isArray(value)) {
      return !value.includes(userValue);
    }
    
    return userValue !== value;
  };

  const getNextQuestionIndex = (currentIndex, responses = userResponses) => {
    let nextIndex = currentIndex + 1;
    while (nextIndex < questions.length && shouldSkipQuestion(nextIndex, responses)) {
      nextIndex++;
    }
    return nextIndex;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && questions[currentQuestion].required) {
      setValidationError('This field is required');
      return;
    }

    const currentQ = questions[currentQuestion];
    
    // Validate input
    if (currentQ.validation) {
      const error = currentQ.validation(inputValue);
      if (error) {
        setValidationError(error);
        return;
      }
    }

    setValidationError('');
    setMessages(prev => [...prev, { type: 'user', text: inputValue || 'Skipped' }]);
    
    const newResponses = { ...userResponses, [currentQ.id]: inputValue };
    setUserResponses(newResponses);
    setInputValue('');

    setTimeout(() => {
      const nextIndex = getNextQuestionIndex(currentQuestion, newResponses);
      if (nextIndex < questions.length) {
        setCurrentQuestion(nextIndex);
        addBotMessage(questions[nextIndex].question);
      } else {
        setIsComplete(true);
        addBotMessage("🎉 Registration complete! Thank you for joining 8-Squared. Your data has been saved. We'll contact you soon!");
        saveToFile(newResponses);
      }
    }, 500);
  };

  const handleSkip = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ.skippable) return;

    setValidationError('');
    setMessages(prev => [...prev, { type: 'user', text: 'Skipped' }]);
    
    const newResponses = { ...userResponses, [currentQ.id]: '' };
    setUserResponses(newResponses);
    setInputValue('');

    setTimeout(() => {
      const nextIndex = getNextQuestionIndex(currentQuestion, newResponses);
      if (nextIndex < questions.length) {
        setCurrentQuestion(nextIndex);
        addBotMessage(questions[nextIndex].question);
      } else {
        setIsComplete(true);
        addBotMessage("🎉 Registration complete! Thank you for joining 8-Squared. Your data has been saved. We'll contact you soon!");
        saveToFile(newResponses);
      }
    }, 500);
  };

  const handleBack = () => {
    if (currentQuestion === 0) return; // Can't go back from first question

    setValidationError('');
    setInputValue('');

    // Find the actual previous question that was shown (skip over conditional questions)
    let prevIndex = currentQuestion - 1;
    
    // Keep going back until we find a question that wasn't skipped
    while (prevIndex > 0 && shouldSkipQuestion(prevIndex, userResponses)) {
      prevIndex--;
    }
    
    // Remove messages: Remove current bot question and previous user answer
    setMessages(prev => {
      const filtered = [...prev];
      // Always remove at least 2: current bot question + previous user answer
      if (filtered.length >= 2) {
        filtered.pop(); // Remove bot's current question
        filtered.pop(); // Remove user's last answer
      }
      return filtered;
    });

    // Clear the response for the PREVIOUS question (the one we're going back to)
    const prevQ = questions[prevIndex];
    const updatedResponses = { ...userResponses };
    delete updatedResponses[prevQ.id];
    setUserResponses(updatedResponses);
    
    // Set to previous question
    setCurrentQuestion(prevIndex);
  };

  const handleOptionClick = (option) => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.type === 'multiple_choice') {
      const current = userResponses[currentQ.id] || [];
      const newSelection = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      setUserResponses({ ...userResponses, [currentQ.id]: newSelection });
    } else {
      setValidationError('');
      setMessages(prev => [...prev, { type: 'user', text: option }]);
      const newResponses = { ...userResponses, [currentQ.id]: option };
      setUserResponses(newResponses);

      setTimeout(() => {
        const nextIndex = getNextQuestionIndex(currentQuestion, newResponses);
        if (nextIndex < questions.length) {
          setCurrentQuestion(nextIndex);
          addBotMessage(questions[nextIndex].question);
        } else {
          setIsComplete(true);
          addBotMessage("🎉 Registration complete! Thank you for joining 8-Squared. Your data has been saved. We'll contact you soon!");
          saveToFile(newResponses);
        }
      }, 500);
    }
  };

  const handleMultipleChoiceSubmit = () => {
    const currentQ = questions[currentQuestion];
    const selected = userResponses[currentQ.id] || [];
    
    if (selected.length === 0 && currentQ.required) {
      setValidationError('Please select at least one option');
      return;
    }

    setValidationError('');
    setMessages(prev => [...prev, { type: 'user', text: selected.join(', ') }]);

    setTimeout(() => {
      const nextIndex = getNextQuestionIndex(currentQuestion, userResponses);
      if (nextIndex < questions.length) {
        setCurrentQuestion(nextIndex);
        addBotMessage(questions[nextIndex].question);
      } else {
        setIsComplete(true);
        addBotMessage("🎉 Registration complete! Thank you for joining 8-Squared. Your data has been saved. We'll contact you soon!");
        saveToFile(userResponses);
      }
    }, 500);
  };

  const currentQ = questions[currentQuestion];

  // Welcome Page
  if (showWelcome) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 60px 20px',
        fontFamily: '"Segoe UI", "Roboto", sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes floatUpDown { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-20px); } 
          }
          
          @media (max-width: 768px) {
            .welcome-content {
              text-align: center !important;
              margin-top: -130px !important;
            }
            .welcome-logo, .welcome-divider, .welcome-text {
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .logo-3d-container {
              width: clamp(350px, 70vw, 500px) !important;
              margin-bottom: 40px !important;
            }
          }
        `}</style>
        
        {/* Golden glow circles in corners */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 97, 0.1), transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-120px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 97, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '80px',
          flexWrap: 'wrap-reverse',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left Content */}
          <div 
            className="welcome-content"
            style={{ 
              flex: '1', 
              minWidth: '300px'
            }}>
            <img 
              src={logoNo} 
              alt="8-Squared Logo" 
              className="welcome-logo"
              style={{
                width: 'clamp(320px, 80%, 500px)',
                height: 'auto',
                marginBottom: '35px',
                display: 'inline-block',
                animation: 'fadeIn 1s ease-out, logoPulse 3s ease-in-out infinite'
              }}
            />
            
            <div 
              className="welcome-divider"
              style={{
                width: '35%',
                height: '2px',
                background: 'linear-gradient(to right, #C9A961, transparent)',
                marginBottom: '35px'
              }}></div>

            <p 
              className="welcome-text"
              style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                color: '#B8A97A',
                lineHeight: '1.7',
                marginBottom: '15px',
                fontWeight: '300',
                maxWidth: '600px'
              }}>
              Where every move reflects strategy, precision, and passion. Whether you're a beginner learning your first moves or a grandmaster sharpening your skills, our club has a place for you.
            </p>

            <p 
              className="welcome-text"
              style={{
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                color: '#A89968',
                marginBottom: '50px',
                fontWeight: '300',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}>
              Click "Register" below to join a community where every move counts.
            </p>

            <button
              onClick={() => setShowWelcome(false)}
              style={{
                padding: '20px 60px',
                fontSize: 'clamp(17px, 2.2vw, 22px)',
                fontWeight: '500',
                backgroundColor: '#C9A961',
                color: '#000000',
                border: '2px solid #C9A961',
                borderRadius: '40px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 8px 25px rgba(201, 169, 97, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#D4B76E';
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 40px rgba(201, 169, 97, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                e.target.style.borderColor = '#D4B76E';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#C9A961';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(201, 169, 97, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = '#C9A961';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(-1px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
              }}
            >
              Register
            </button>
          </div>

          {/* Right Image - 3D Chess Logo */}
          <div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '300px',
            position: 'relative'
          }}>
            {/* Golden glow under the image */}
            <div style={{
              position: 'absolute',
              bottom: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(201, 169, 97, 0.5), transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              zIndex: 0
            }}></div>
            
            <div 
              className="logo-3d-container"
              style={{
                width: 'clamp(280px, 70vw, 450px)',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                animation: 'floatUpDown 3s ease-in-out infinite'
              }}>
              <img 
                src={logo3d} 
                alt="Logo" 
                style={{
                  width: '100%', 
                  height: 'auto'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
          padding: '15px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10
        }}>
          © 2025 8-Squared Chess Club | Developed by Amira Roumili (HR Department)
        </div>
      </div>
    );
  }

  // Chat Bot Page
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
      position: 'relative'
    }}>
      {/* Logo Header - Top Left */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '30px',
        zIndex: 10
      }}>
        <img 
          src={logoNo} 
          alt="8-Squared Logo" 
          style={{
            height: '50px',
            width: 'auto'
          }}
        />
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes floatUpDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        
        .chat-container::-webkit-scrollbar {
          width: 8px;
        }
        .chat-container::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .chat-container::-webkit-scrollbar-thumb {
          background: #C9A961;
          border-radius: 4px;
        }
        .chat-container::-webkit-scrollbar-thumb:hover {
          background: #D4B76E;
        }
      `}</style>

      {/* Chat Messages Container - Fills remaining space */}
      <div 
        className="chat-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '100px 15px 20px 15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Bot Name Label at the start of conversation */}
        {messages.length > 0 && (
          <div style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '15px',
            fontWeight: '500',
            letterSpacing: '1px'
          }}>
            8-SQUARED
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '20px',
              animation: 'slideIn 0.4s ease-out'
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: '14px 20px',
              borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: msg.type === 'user' ? '#1a1a1a' : '#C9A961',
              color: msg.type === 'user' ? '#C9A961' : '#000000',
              border: msg.type === 'user' ? '1px solid #C9A961' : 'none',
              fontWeight: '400',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              lineHeight: '1.6',
              letterSpacing: '0.3px',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-line'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '14px 20px',
              borderRadius: '20px 20px 20px 4px',
              backgroundColor: '#C9A961',
              display: 'flex',
              gap: '6px'
            }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    animation: `pulse 1.4s infinite ease-in-out ${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      {!isComplete && (
        <div style={{
          padding: '0',
          backgroundColor: '#000000',
          borderTop: '1px solid #2a2a2a',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{ padding: '20px 20px 10px 20px' }}>
          {/* Validation Error Message */}
          {validationError && (
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#ff4444',
              color: '#fff',
              borderRadius: '10px',
              marginBottom: '15px',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              animation: 'shake 0.5s ease-in-out'
            }}>
              ⚠️ {validationError}
            </div>
          )}
          
          {currentQ.type === 'text' && (
            <>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                alignItems: 'center',
                backgroundColor: '#0a0a0a',
                padding: '8px 8px 8px 20px',
                borderRadius: '25px',
                border: '1px solid #333',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C9A961';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(201, 169, 97, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={currentQ.placeholder}
                  style={{
                    flex: '1',
                    padding: '14px 0',
                    backgroundColor: 'transparent',
                    color: '#C9A961',
                    border: 'none',
                    outline: 'none',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontWeight: '400',
                    letterSpacing: '0.3px'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: '12px',
                    backgroundColor: 'transparent',
                    color: '#C9A961',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '50%',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1a1a1a';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
              
              {/* Back and Skip buttons row */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {/* Back Button */}
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#888',
                      border: '1px solid #333',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      flex: '1',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1a1a1a';
                      e.target.style.color = '#C9A961';
                      e.target.style.borderColor = '#C9A961';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#888';
                      e.target.style.borderColor = '#333';
                    }}
                  >
                    ← Back
                  </button>
                )}

                {/* Skip Button */}
                {currentQ.skippable && (
                  <button
                    onClick={handleSkip}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#888',
                      border: '1px solid #333',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      flex: '1',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1a1a1a';
                      e.target.style.color = '#aaa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#888';
                    }}
                  >
                    Skip →
                  </button>
                )}
              </div>
            </>
          )}

          {currentQ.type === 'mcq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {(() => {
                  // Filter out primary department from secondary department options
                  let filteredOptions = currentQ.options;
                  if (currentQ.id === 'secondary_department' && userResponses.primary_department) {
                    filteredOptions = currentQ.options.filter(option => option !== userResponses.primary_department);
                  }
                  
                  return filteredOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      style={{
                        padding: '12px 28px',
                        backgroundColor: 'transparent',
                        color: '#C9A961',
                        border: '1px solid #C9A961',
                        borderRadius: '25px',
                        fontWeight: '400',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.5px',
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 8px rgba(201, 169, 97, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#C9A961';
                        e.target.style.color = '#000000';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(201, 169, 97, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#C9A961';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(201, 169, 97, 0.2)';
                    }}
                  >
                    {option}
                  </button>
                  ));
                })()}
              </div>
              
              {/* Back button for MCQ */}
              {currentQuestion > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#888',
                    border: '1px solid #333',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '400',
                    transition: 'all 0.3s ease',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1a1a1a';
                    e.target.style.color = '#C9A961';
                    e.target.style.borderColor = '#C9A961';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#888';
                    e.target.style.borderColor = '#333';
                  }}
                >
                  ← Back
                </button>
              )}
            </div>
          )}

          {currentQ.type === 'multiple_choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {currentQ.options.map((option, idx) => {
                  const selected = (userResponses[currentQ.id] || []).includes(option);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        handleOptionClick(option);
                        setValidationError('');
                      }}
                      style={{
                        padding: '12px 28px',
                        backgroundColor: selected ? '#C9A961' : 'transparent',
                        color: selected ? '#000000' : '#C9A961',
                        border: '1px solid #C9A961',
                        borderRadius: '25px',
                        fontWeight: '400',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              
              {/* Submit and Back buttons row */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center', justifyContent: 'center' }}>
                {/* Back Button */}
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#888',
                      border: '1px solid #333',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1a1a1a';
                      e.target.style.color = '#C9A961';
                      e.target.style.borderColor = '#C9A961';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#888';
                      e.target.style.borderColor = '#333';
                    }}
                  >
                    ← Back
                  </button>
                )}
                
                {/* Submit Button */}
                <button
                  onClick={handleMultipleChoiceSubmit}
                  disabled={(userResponses[currentQ.id] || []).length === 0}
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#C9A961',
                    color: '#000000',
                    fontWeight: '500',
                    fontSize: 'clamp(15px, 2.5vw, 17px)',
                    borderRadius: '25px',
                    border: 'none',
                    cursor: (userResponses[currentQ.id] || []).length === 0 ? 'not-allowed' : 'pointer',
                    opacity: (userResponses[currentQ.id] || []).length === 0 ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px'
                  }}
                >
                  Submit Selection
                </button>
              </div>
            </div>
          )}
          </div>

          {/* Progress Bar */}
          <div style={{
            padding: '0 20px 20px 20px'
          }}>
            <div style={{
              width: '100%',
              height: '3px',
              backgroundColor: '#1a1a1a',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                height: '100%',
                backgroundColor: '#C9A961',
                transition: 'width 0.5s ease',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(201, 169, 97, 0.5)'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: '#C9A961',
            marginBottom: '20px'
          }}>
            Thank you for registering! We'll be in touch soon.
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #2a2a2a'
          }}>
            © 2025 8-Squared Chess Club | Developed by Amira Roumili (HR Department)
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessRegistrationBot;