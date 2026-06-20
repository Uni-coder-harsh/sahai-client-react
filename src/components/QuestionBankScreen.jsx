import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  RefreshCcw, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  Terminal,
  BrainCircuit,
  Lock,
  ChevronRight,
  Upload,
  Image
} from 'lucide-react';

export default function QuestionBankScreen({ user }) {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected question for solving
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Scratchpad & Telemetry state (inside solver modal)
  const [scratchpadCode, setScratchpadCode] = useState('# Dry run your helper code here\n# Type, erase, and test to interact with the behavior model\n\ndef dry_run():\n    pass');
  const [runLogs, setRunLogs] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Tab & OCR state
  const [activeTabRight, setActiveTabRight] = useState('code'); // 'code' or 'handwriting'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [ocrResponse, setOcrResponse] = useState(null);
  
  // Floating Toast state
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };
  
  // Telemetry counters
  const telemetryRef = useRef({
    timeSpent: 0,
    runCount: 0,
    backspaceCount: 0,
    pasteCharCount: 0,
    syntaxErrorCount: 0
  });

  const timerRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.fetchAllQuestions(user.id);
      setQuestions(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load questions list. Please verify your API Gateway.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user.id]);

  // Handle open question solver
  const handleOpenSolver = async (question) => {
    setActiveQuestion(question);
    setSubmitResult(null);
    setSelectedOptionId('');
    setElapsedTime(0);
    setRunLogs([]);
    setScratchpadCode(`# Dry run scratchpad for ${question.id}\n# Telemetry tracking active...\n\nx = 5\ny = 10\nprint("Result:", x + y)`);
    setActiveTabRight('code');
    setSelectedImage(null);
    setImagePreview('');
    setOcrResult('');
    
    // Reset telemetry ref
    telemetryRef.current = {
      timeSpent: 0,
      runCount: 0,
      backspaceCount: 0,
      pasteCharCount: 0,
      syntaxErrorCount: 0,
      
      // MCQ nuance tracking fields
      firstOpenTime: Date.now(),
      timeToFirstAction: null,
      optionSwitches: 0,
      lastOptionId: null,
      minClickInterval: 999999,
      lastClickTime: null
    };

    try {
      const details = await api.fetchQuestionDetails(question.id);
      setQuestionDetails(details);
    } catch (err) {
      console.error(err);
      alert('Error fetching question details.');
      setActiveQuestion(null);
    }

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const next = prev + 1;
        telemetryRef.current.timeSpent = next;
        return next;
      });
    }, 1000);
  };

  const handleCloseSolver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveQuestion(null);
    setQuestionDetails(null);
    setSubmitResult(null);
    fetchQuestions(); // Refresh list to update solved checkmarks
  };

  // Process MCQ option selections and update telemetry tracking values
  const handleSelectOption = (optionId) => {
    setSelectedOptionId(optionId);
    
    const now = Date.now();
    const tel = telemetryRef.current;
    
    if (tel.timeToFirstAction === null && tel.firstOpenTime) {
      tel.timeToFirstAction = (now - tel.firstOpenTime) / 1000.0;
    }
    
    if (tel.lastOptionId !== null && tel.lastOptionId !== optionId) {
      tel.optionSwitches = (tel.optionSwitches || 0) + 1;
    }
    tel.lastOptionId = optionId;
    
    if (tel.lastClickTime !== null) {
      const interval = now - tel.lastClickTime;
      if (interval < tel.minClickInterval) {
        tel.minClickInterval = interval;
      }
    }
    tel.lastClickTime = now;
  };

  // Keyboard listener on Scratchpad
  const handleScratchpadKeyDown = (e) => {
    if (e.key === 'Backspace') {
      telemetryRef.current.backspaceCount += 1;
    }
  };

  // Paste listener on Scratchpad
  const handleScratchpadPaste = (e) => {
    const text = e.clipboardData ? e.clipboardData.getData('text') : '';
    telemetryRef.current.pasteCharCount += text.length;
  };

  const handleDryRun = () => {
    telemetryRef.current.runCount += 1;
    
    // Dispatch telemetry compile log
    window.dispatchEvent(new CustomEvent('telemetry-log', {
      detail: `📡 Sandbox Compile Triggered. Compiles: ${telemetryRef.current.runCount}`
    }));
    
    const lines = scratchpadCode.split('\n');
    let hasSyntaxError = false;
    let errorMsg = '';

    // Mock syntax checks to make it interesting
    for (let line of lines) {
      // Check for simple unclosed brackets
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        hasSyntaxError = true;
        errorMsg = 'SyntaxError: Parenthesis mismatch';
        break;
      }
      
      // Check unclosed quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        hasSyntaxError = true;
        errorMsg = 'SyntaxError: Unterminated string literal';
        break;
      }

      // Check indented lines missing colon on parent
      if (line.trim().startsWith('print') && !scratchpadCode.includes(':') && scratchpadCode.includes('def ')) {
        hasSyntaxError = true;
        errorMsg = 'IndentationError: expected an indented block';
        break;
      }
    }

    if (hasSyntaxError) {
      telemetryRef.current.syntaxErrorCount += 1;
      setRunLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Executing code...\n${errorMsg}`
      ]);
    } else {
      // Create mock output based on code snippet
      let output = 'Output:\n';
      if (scratchpadCode.includes('print')) {
        const matches = scratchpadCode.match(/print\(([^)]+)\)/);
        if (matches && matches[1]) {
          output += `> ${matches[1].replace(/['"]/g, '')}\n`;
        } else {
          output += '> Hello World\n';
        }
      } else {
        output += '> (Code executed successfully, no print output)\n';
      }
      setRunLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executing code...\n${output}Process finished with exit code 0`
      ]);
    }
  };

  // OCR note scanning handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOcrScan = () => {
    if (!selectedImage) return;

    setOcrScanning(true);
    setOcrResult('');
    setOcrResponse(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const questionConcept = activeQuestion.concept_nodes 
          ? activeQuestion.concept_nodes.split(',')[0].trim() 
          : 'PY_SYNTAX_01';
          
        try {
          const res = await api.sendTelemetry({
            interaction_type: 'OCR_HANDWRITING',
            image_base64: base64Data,
            user_id: user.id,
            node_id: questionConcept,
            question_id: activeQuestion.id,
            metrics: {
              time_spent_sec: telemetryRef.current.timeSpent || 30,
              run_count: telemetryRef.current.runCount || 0,
              backspace_count: telemetryRef.current.backspaceCount || 0,
              paste_char_count: telemetryRef.current.pasteCharCount || 0,
              syntax_error_count: telemetryRef.current.syntaxErrorCount || 0,
              label: 'NORMAL'
            }
          });

          if (res.extracted_text) {
            setOcrResult(res.extracted_text);
            setOcrResponse(res);
            triggerToast('Handwritten code processed & evaluated successfully!');
            if (res.developer_debug_logs && Array.isArray(res.developer_debug_logs)) {
              console.log('%c=== [DEVELOPER DEBUG] HANDWRITING OCR PIPELINE ===', 'color: #00ffcc; font-weight: bold;');
              res.developer_debug_logs.forEach(line => {
                console.log(`[Python Engine] ${line}`);
              });
              console.log('%c==================================================', 'color: #00ffcc; font-weight: bold;');
            }
          } else {
            setOcrResult('# OCR failed to extract text.\nPlease try with a clearer image.');
            if (res.developer_debug_logs && Array.isArray(res.developer_debug_logs)) {
              console.log('%c=== [DEVELOPER DEBUG] HANDWRITING OCR PIPELINE (FAILED) ===', 'color: #ff3333; font-weight: bold;');
              res.developer_debug_logs.forEach(line => {
                console.log(`[Python Engine] ${line}`);
              });
              console.log('%c==================================================', 'color: #ff3333; font-weight: bold;');
            }
          }
        } catch (err) {
          console.error('Failed to process note scan:', err);
          setOcrResult(`# Scan Error: ${err.message || 'Verification failed.'}`);
        } finally {
          setOcrScanning(false);
        }
      };
    } catch (err) {
      console.error('FileReader error:', err);
      setOcrResult(`# File Error: ${err.message}`);
      setOcrScanning(false);
    }
  };

  // Submit Answer & Telemetry payload
  const handleSubmitAnswer = async () => {
    if (!selectedOptionId) {
      alert('Please select an option first.');
      return;
    }
    
    setSubmitLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const tel = telemetryRef.current;
    const wordCount = activeQuestion.question_text ? activeQuestion.question_text.split(/\s+/).filter(Boolean).length : 50;
    const timeToFirst = tel.timeToFirstAction !== null ? tel.timeToFirstAction : (tel.timeSpent || 10.0);
    const readingVel = wordCount / (timeToFirst || 1.0);
    const minClickInt = tel.minClickInterval !== 999999 ? tel.minClickInterval : 1000.0;

    const telemetryPayload = {
      user_id: user.id,
      question_id: activeQuestion.id,
      option_id: selectedOptionId,
      time_spent_seconds: tel.timeSpent,
      run_count: tel.runCount,
      backspace_count: tel.backspaceCount,
      paste_char_count: tel.pasteCharCount,
      syntax_error_count: tel.syntaxErrorCount,
      
      // MCQ nuance telemetry
      question_word_count: wordCount,
      time_to_first_action_sec: timeToFirst,
      reading_velocity: readingVel,
      option_switch_count: tel.optionSwitches || 0,
      minimum_click_interval_ms: minClickInt,
      network_drop_duration_sec: 0.0
    };

    try {
      const res = await api.submitAnswer(telemetryPayload);
      setSubmitResult(res);
      
      if (res.telemetry_updates && res.telemetry_updates.length > 0) {
        const summary = res.telemetry_updates.map(up => 
          `${up.node_id}: E[K] = ${(up.expected_mastery * 100).toFixed(1)}%`
        ).join(', ');
        triggerToast(`Bayesian update synced: ${summary}`);
        console.log('[Developer Help] Bayesian parameters updated successfully:', res.telemetry_updates);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit answer.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Submit Code Solution
  const handleSubmitCode = async () => {
    setSubmitLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const conceptNode = activeQuestion.concept_nodes 
        ? activeQuestion.concept_nodes.split(',')[0].trim() 
        : 'PY_SYNTAX_01';

      await api.sendTelemetry({
        user_id: user.id,
        node_id: conceptNode,
        event_type: 'CODE_SUBMISSION',
        success: true,
        attempts: telemetryRef.current.runCount || 1,
        code_snippet: scratchpadCode,
        behavioral_flags: telemetryRef.current.syntaxErrorCount > 0 ? ['SYNTAX_ERRORS_FIXED'] : [],
        time_spent_seconds: telemetryRef.current.timeSpent
      });

      // Show a nice completion screen
      setSubmitResult({
        success: true,
        message: language === 'hi'
          ? 'कोड संकलन टेलीमेट्री सफलतापूर्वक संसाधित की गई! महारत स्कोर सिंक हो गए।'
          : 'Code compilation telemetry processed successfully! Mastery scores synced.',
        concepts_evaluated: activeQuestion.concept_nodes ? activeQuestion.concept_nodes.split(',').map(c => c.trim()) : [conceptNode],
        telemetry_updates: [
          {
            node_id: conceptNode,
            expected_mastery: 0.75, // mock indicator representing update
            behavior_class: telemetryRef.current.pasteCharCount > 50 ? 2 : telemetryRef.current.runCount > 4 ? 1 : 0
          }
        ]
      });

      triggerToast(`Code telemetry processed for node: ${conceptNode}`);
      console.log('[Developer Help] Bayesian parameters updated via code telemetry:', conceptNode);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit code.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Submit Handwriting OCR scan
  const handleSubmitHandwriting = async () => {
    if (!ocrResponse) {
      alert('Please process a note scan first.');
      return;
    }
    setSubmitLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const isCorrect = ocrResponse.grade_result ? ocrResponse.grade_result.is_correct : true;
      const targetNode = ocrResponse.bayesian_update ? ocrResponse.bayesian_update.target_node : (activeQuestion.concept_nodes ? activeQuestion.concept_nodes.split(',')[0].trim() : 'PY_SYNTAX_01');
      const expectedMastery = ocrResponse.bayesian_update ? ocrResponse.bayesian_update.expected_mastery : 0.75;
      const explanation = ocrResponse.grade_result ? ocrResponse.grade_result.logical_flaw_explanation : null;

      const telemetryUpdates = [
        {
          node_id: targetNode,
          expected_mastery: expectedMastery,
          behavior_class: 0
        }
      ];

      if (ocrResponse.bayesian_update && ocrResponse.bayesian_update.propagations) {
        ocrResponse.bayesian_update.propagations.forEach(p => {
          telemetryUpdates.push({
            node_id: p.source_node,
            expected_mastery: p.expected_mastery,
            behavior_class: 0
          });
        });
      }

      const successMsg = language === 'hi'
        ? 'हस्तलिखित कोड तार्किक रूप से सही है! संज्ञानात्मक महारत को अपडेट कर दिया गया है।'
        : 'Handwritten code is logically correct! Cognitive mastery updated.';
        
      const failMsg = language === 'hi'
        ? `अशुद्ध: ${explanation || 'तार्किक विफलता।'}`
        : `Incorrect: ${explanation || 'Logic breakdown.'}`;

      setSubmitResult({
        success: isCorrect,
        message: isCorrect ? successMsg : failMsg,
        concepts_evaluated: [targetNode],
        telemetry_updates: telemetryUpdates
      });

      triggerToast(`Handwriting evaluation complete: ${isCorrect ? 'SUCCESS' : 'LOGICAL FLAW'}`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grading.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Statistics calculation
  const totalCount = questions.length;
  const completedCount = questions.filter(q => q.status === 'COMPLETED').length;
  const attemptedCount = questions.filter(q => q.status === 'ATTEMPTED').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.concept_nodes && q.concept_nodes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty_level.toUpperCase() === difficultyFilter;
    
    const matchesStatus = statusFilter === 'ALL' || q.status.toUpperCase() === statusFilter;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getQuestionType = () => {
    if (!questionDetails) return 'mcq';
    if (questionDetails.options && questionDetails.options.length > 0) {
      return 'mcq';
    }
    const conceptStr = String(activeQuestion.concept_nodes || '').toUpperCase();
    const idStr = String(activeQuestion.id || '').toUpperCase();
    const textStr = String(activeQuestion.question_text || '').toUpperCase();
    if (conceptStr.includes('OCR') || idStr.includes('OCR') || textStr.includes('OCR') || textStr.includes('HANDWRITING') || textStr.includes('SCAN')) {
      return 'handwriting';
    }
    return 'code';
  };

  const questionType = activeQuestion ? getQuestionType() : 'mcq';

  return (
    <div className="animate-fade-in" style={{ padding: '8px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen style={{ color: 'var(--primary)' }} />
            <span>SahAI Question Bank</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Practice customized MCQ problems, dry run code, and build your Bayesian cognitive mesh.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchQuestions} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Problems</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>{totalCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <BookOpen size={24} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solved Problems</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--success)' }}>{completedCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attempted (Weak)</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--warning)' }}>{attemptedCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <HelpCircle size={24} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mastery Rate</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent)' }}>{completionRate}%</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)' }}>
            <BrainCircuit size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by title, topic, or node ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px', width: '100%', height: '42px' }}
            />
          </div>

          {/* Selector filters */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filters:</span>
            </div>

            {/* Difficulty selector */}
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', padding: '0 12px', height: '42px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Status selector */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', padding: '0 12px', height: '42px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="UNATTEMPTED">Unattempted</option>
            </select>
          </div>

        </div>
      </div>

      {/* Questions List Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
          <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
          <HelpCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No Problems Match Your Criteria</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Try adjusting your keywords, difficulty level, or completion status filters.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 20px', width: '90px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Problem Description</th>
                <th style={{ padding: '16px 20px' }}>Concept Node Tags</th>
                <th style={{ padding: '16px 20px', width: '120px' }}>Difficulty</th>
                <th style={{ padding: '16px 20px', width: '120px' }}>Est. Time</th>
                <th style={{ padding: '16px 20px', width: '120px', textAlign: 'right' }}>Solve</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q, idx) => {
                const concepts = q.concept_nodes ? q.concept_nodes.split(',').map(c => c.trim()) : [];
                return (
                  <tr 
                    key={q.id} 
                    style={{ 
                      borderBottom: idx === filteredQuestions.length - 1 ? 'none' : '1px solid var(--border-color)',
                      background: idx % 2 === 0 ? 'none' : 'rgba(255,255,255,0.01)',
                      transition: 'background var(--transition-fast)'
                    }}
                    className="hover-row"
                  >
                    {/* Status Badge */}
                    <td style={{ padding: '16px 20px' }}>
                      {q.status === 'COMPLETED' ? (
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }} title="Solved & Completed">
                          <CheckCircle2 size={20} />
                        </span>
                      ) : q.status === 'ATTEMPTED' ? (
                        <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }} title="Attempted with failure history">
                          <AlertCircle size={20} />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }} title="Unattempted">
                          <HelpCircle size={20} style={{ opacity: 0.4 }} />
                        </span>
                      )}
                    </td>

                    {/* Question text */}
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{q.id}</span>
                        <span style={{ fontSize: '0.92rem', display: 'inline-block', maxWidth: '380px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {q.question_text}
                        </span>
                      </div>
                    </td>

                    {/* Subtopic tags */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {concepts.map((node, cIdx) => (
                          <span 
                            key={cIdx} 
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              background: node.includes('SYNTAX') ? 'rgba(99, 102, 241, 0.12)' : 'rgba(236, 72, 153, 0.12)',
                              color: node.includes('SYNTAX') ? 'var(--primary)' : '#f43f5e',
                              border: node.includes('SYNTAX') ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(236, 72, 153, 0.2)',
                              fontWeight: 600
                            }}
                          >
                            {node}
                          </span>
                        ))}
                        {concepts.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>General Syntax</span>}
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td style={{ padding: '16px 20px' }}>
                      <span 
                        style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase',
                          color: q.difficulty_level.toUpperCase() === 'EASY' ? 'var(--success)' : 
                                 q.difficulty_level.toUpperCase() === 'MEDIUM' ? 'var(--warning)' : 'var(--error)'
                        }}
                      >
                        {q.difficulty_level}
                      </span>
                    </td>

                    {/* Expected time */}
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        <span>{q.expected_time || 5} min</span>
                      </div>
                    </td>

                    {/* Action button */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleOpenSolver(q)}
                        style={{ height: '32px', padding: '0 12px', fontSize: '0.85rem' }}
                      >
                        <span>Solve</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Solver Modal Overlay */}
      {activeQuestion && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '1200px', height: '100%', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{activeQuestion.id} • {activeQuestion.difficulty_level}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>Solving: {activeQuestion.id}</h3>
              </div>
              
              {/* Telemetry info header */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Clock size={16} />
                  <span>Time Elapsed: <strong>{elapsedTime}s</strong></span>
                </div>
                <button 
                  onClick={handleCloseSolver}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 300 }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Content Layout */}
            <div style={{ display: 'flex', flex: '1', overflow: 'hidden' }}>
              
              {submitResult ? (
                // SUBMIT RESULT SCREEN (FULL WIDTH)
                <div style={{ flex: '1', padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
                    <div style={{ margin: '0 auto', width: '64px', height: '64px', borderRadius: '50%', background: submitResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: submitResult.success ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {submitResult.success ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
                    </div>
                    
                    <div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: submitResult.success ? 'var(--success)' : 'var(--error)' }}>
                        {submitResult.success ? 'Correct Answer!' : 'Incorrect Answer'}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        {submitResult.success ? 'Great job! Prerequisite node values updated successfully.' : 'No worries, analyze the distraction audit triggers to learn.'}
                      </p>
                    </div>

                    {/* Telemetry Updates */}
                    <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', textAlign: 'left' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BrainCircuit size={18} style={{ color: 'var(--primary)' }} />
                        <span>Bayesian Cognitive Graph updates:</span>
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {submitResult.telemetry_updates?.map((up, idx) => (
                          <div key={idx} style={{ borderBottom: idx === submitResult.telemetry_updates.length - 1 ? 'none' : '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Concept: {up.node_id}</span>
                              <span style={{ color: 'var(--warning)', fontWeight: 700 }}>
                                E[K]: {up.expected_mastery !== undefined && !isNaN(up.expected_mastery) ? `${(up.expected_mastery * 100).toFixed(1)}%` : '--'}
                              </span>
                            </div>
                            
                            {/* Behavioral report */}
                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              <strong>ML Behavior Classifier: </strong>
                              {(up.behavior_class === 0 || up.behavior_class === '0') && <span style={{ color: 'var(--success)' }}>Normal interaction patterns verified. Full rewards applied.</span>}
                              {(up.behavior_class === 1 || up.behavior_class === '1') && <span style={{ color: 'var(--warning)' }}>Shotgun Debugging pattern flagged. Updates penalized (50%).</span>}
                              {(up.behavior_class === 2 || up.behavior_class === '2') && <span style={{ color: 'var(--error)' }}>Copy-Paste pattern flagged. Mastery reward discounted (90%).</span>}
                              {(up.behavior_class === 3 || up.behavior_class === '3') && <span style={{ color: 'var(--warning)' }}>Blind Guessing pattern flagged. Mastery updates penalized (90%).</span>}
                              {(up.behavior_class === 4 || up.behavior_class === '4') && <span style={{ color: 'var(--warning)' }}>Foundational Void flagged. Revision of prerequisites recommended.</span>}
                              {(up.behavior_class === 5 || up.behavior_class === '5') && <span style={{ color: 'var(--warning)' }}>Anxious Overworking / Accidental Misclick pattern flagged. Mastery adjusted.</span>}
                              {up.behavior_class === undefined && <span style={{ color: 'var(--text-muted)' }}>Interactive telemetry verified.</span>}
                            </div>

                            {/* Prerequisite ripple updates info */}
                            {up.propagations && up.propagations.length > 0 && (
                              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>
                                <strong>Propagations: </strong> 
                                {up.propagations.map(p => `${p.source_node} (${(p.expected_mastery * 100).toFixed(1)}%)`).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleCloseSolver} style={{ height: '44px', width: '180px', alignSelf: 'center' }}>
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                // SOLVER LAYOUT
                <>
                  {/* Left Panel: Question description + Option picker (MCQ) */}
                  <div style={{ flex: questionType === 'mcq' ? '1' : '1.1', padding: '24px', overflowY: 'hidden', borderRight: questionType === 'mcq' ? 'none' : '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Scrollable Question details & Options */}
                    <div style={{ flex: '1', overflowY: 'auto', marginBottom: '20px', paddingRight: '8px' }}>
                      {/* Question text block */}
                      <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                          {questionDetails?.question_text || activeQuestion.question_text}
                        </p>
                      </div>

                      {questionType === 'mcq' && (
                        /* MCQ Mode options */
                        questionDetails ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {questionDetails.options?.map((opt) => (
                              <label 
                                key={opt.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '14px', 
                                  padding: '16px', 
                                  borderRadius: '10px', 
                                  background: selectedOptionId === opt.id ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.01)',
                                  border: selectedOptionId === opt.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-fast)'
                                }}
                              >
                                <input 
                                  type="radio" 
                                  name="mcq_option" 
                                  value={opt.id}
                                  checked={selectedOptionId === opt.id}
                                  onChange={() => handleSelectOption(opt.id)}
                                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <span style={{ fontWeight: 800, color: selectedOptionId === opt.id ? 'var(--primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{opt.option_letter}.</span>
                                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{opt.option_text}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
                            <div style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                          </div>
                        )
                      )}
                    </div>

                    {questionType === 'mcq' ? (
                      /* Submit Actions */
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Telemetry signature will be transmitted synchronously on submit</span>
                        <button 
                          className="btn btn-primary"
                          onClick={handleSubmitAnswer}
                          disabled={submitLoading || !selectedOptionId}
                          style={{ height: '44px', padding: '0 28px' }}
                        >
                          {submitLoading ? 'Calculating Updates...' : 'Submit Response'}
                        </button>
                      </div>
                    ) : (
                      /* Code / Handwriting Instructions block */
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', display: 'block', marginBottom: '8px' }}>
                          {questionType === 'code' ? '💻 Coding Challenge Mode' : '📝 Handwriting OCR Mode'}
                        </span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          {questionType === 'code' 
                            ? 'Develop your solution in the Code Scratchpad on the right. Once code compiling tests pass, submit it to log cognitive mastery progress.' 
                            : 'Upload your written margins notes scan on the right, process note scan and submit for processing.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Panel: Dry-Run Scratchpad (Code) OR Note Scanner (Handwriting) */}
                  {questionType !== 'mcq' && (
                    <div style={{ flex: '1', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', flexDirection: 'column' }}>
                      
                      {questionType === 'code' ? (
                        /* Code Scratchpad view exclusively */
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          {/* Scratchpad Subheader */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Python Compiler Simulator</span>
                            <button 
                              className="btn btn-secondary"
                              onClick={handleDryRun}
                              disabled={submitLoading}
                              style={{ height: '28px', padding: '0 10px', fontSize: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                            >
                              <Play size={12} style={{ marginRight: '4px' }} />
                              <span>Run Dry Run</span>
                            </button>
                          </div>

                          {/* Scratchpad Editor Area */}
                          <div style={{ flex: '1', display: 'flex', flexDirection: 'row', position: 'relative', overflowY: 'auto' }}>
                            <div style={{ width: '40px', padding: '14px 0', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', userSelect: 'none', lineHeight: '1.5' }}>
                              {Array.from({ length: scratchpadCode.split('\n').length || 1 }).map((_, i) => (
                                <span key={i}>{i + 1}</span>
                              ))}
                            </div>
                            
                            <textarea
                              value={scratchpadCode}
                              onChange={(e) => setScratchpadCode(e.target.value)}
                              onKeyDown={handleScratchpadKeyDown}
                              onPaste={handleScratchpadPaste}
                              disabled={submitLoading}
                              style={{ 
                                flex: '1',
                                background: 'none',
                                border: 'none',
                                resize: 'none',
                                outline: 'none',
                                color: '#a5b4fc',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                padding: '14px',
                                height: '100%',
                                tabSize: '4'
                              }}
                            />
                          </div>

                          {/* Output log drawer */}
                          <div style={{ height: '180px', borderTop: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.6)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <Terminal size={12} />
                              <span>Dry Run Output Terminal</span>
                            </div>
                            
                            <div style={{ flex: '1', padding: '12px 16px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c7d2fe', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                              {runLogs.length === 0 ? (
                                <span style={{ color: 'var(--text-muted)' }}>Click "Run Dry Run" to compile and run code block. Telemetry hooks will record keystroke patterns.</span>
                              ) : (
                                runLogs[runLogs.length - 1]
                              )}
                            </div>
                          </div>

                          {/* Telemetry diagnostics drawer & Submit action */}
                          <div style={{ padding: '12px 20px', background: 'rgba(99, 102, 241, 0.04)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              <span>Telemetry State: ACTIVE</span>
                              <div style={{ display: 'flex', gap: '16px' }}>
                                <span>Runs: <strong>{telemetryRef.current.runCount}</strong></span>
                                <span>Backspaces: <strong>{telemetryRef.current.backspaceCount}</strong></span>
                                <span>Pasted Chars: <strong>{telemetryRef.current.pasteCharCount}</strong></span>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={handleSubmitCode}
                              disabled={submitLoading}
                              style={{ width: '100%', height: '40px' }}
                            >
                              <span>{submitLoading ? 'Calculating Updates...' : 'Submit Code Solution'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Handwriting Note Scanner view exclusively */
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto', gap: '20px' }}>
                          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '30px 20px', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', position: 'relative', marginBottom: '16px' }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={ocrScanning || submitLoading}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                              />
                              {imagePreview ? (
                                <img src={imagePreview} alt="Handwriting Scan" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }} />
                              ) : (
                                <>
                                  <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Upload offline note scan image</span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG or JPEG up to 10MB</span>
                                </>
                              )}
                            </div>

                            <button
                              className="btn btn-primary"
                              onClick={handleOcrScan}
                              disabled={!selectedImage || ocrScanning || submitLoading}
                              style={{ width: '100%', height: '40px', marginBottom: '12px' }}
                            >
                              <Image size={14} style={{ marginRight: '6px' }} />
                              <span>{ocrScanning ? 'Scanning Text OCR...' : 'Process Note Scan'}</span>
                            </button>
                          </div>

                          {/* OCR Parsing preview & submit zone */}
                          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', minHeight: '220px', gap: '12px' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Parsed Note Code</h4>
                            
                            {ocrScanning ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px' }}>
                                <div style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--accent)', borderRadius: '50%', width: '28px', height: '28px', animation: 'spin 1s linear infinite' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Extracting text from notebook margins...</p>
                              </div>
                            ) : ocrResult ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                <pre style={{ background: '#0d0e12', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', color: '#14b8a6', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flex: 1, maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                  {ocrResult}
                                </pre>
                                <button
                                  className="btn btn-accent"
                                  onClick={handleSubmitHandwriting}
                                  disabled={submitLoading}
                                  style={{ width: '100%', height: '40px' }}
                                >
                                  Submit Handwriting Telemetry
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', textAlign: 'center' }}>
                                <Upload size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.75rem' }}>Upload handwriting images on the left to sync study telemetry.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.025em',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
          }}>
            ✓
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
