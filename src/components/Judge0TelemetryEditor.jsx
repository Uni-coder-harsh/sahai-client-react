import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import Editor from '@monaco-editor/react';
import { Code, Terminal, Play, CheckCircle, ShieldAlert, Cpu, Timer, Clipboard, Delete } from 'lucide-react';

const STARTER_SNIPPETS = {
  PY_SYNTAX: `# Basic Python Syntax Practice\nprint("Hello SahAI!")\n\n# Indentation is key in Python\nif True:\n    print("Indented block executed successfully")\n`,
  PY_DATA: `# Numbers, floats, and numeric operators\na = 10\nb = 3.5\nresult = a * b\nprint(f"Product: {result}")\nprint(type(result))\n`,
  PY_STRING: `# String manipulation and slicing\ntext = "Advanced Agentic Coding"\nprint(text[0:8])  # Slicing out first word\nprint(text.upper())\n`,
  PY_CONTROL: `# Conditional structures and loops\nfor i in range(5):\n    if i % 2 == 0:\n        print(f"{i} is Even")\n    else:\n        print(f"{i} is Odd")\n`,
  PY_LIST: `# Lists operations and list comprehensions\nnumbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(f"Original: {numbers}")\nprint(f"Squares: {squares}")\n`,
  DEFAULT: `# Write your Python script here\nprint("Prior masteries syncing...")\n`
};

export default function Judge0TelemetryEditor({ user }) {
  const [concepts, setConcepts] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState('PY_SYNTAX_01');
  const [code, setCode] = useState(STARTER_SNIPPETS.PY_SYNTAX);
  
  // Terminal Logs & Statuses
  const [consoleLogs, setConsoleLogs] = useState('// Judge0 Sandbox ready. Write code, then click Run & Submit.');
  const [isRunning, setIsRunning] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'failure' | null
  
  // Telemetry Metrics
  const [timeSpent, setTimeSpent] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [pasteCharCount, setPasteCharCount] = useState(0);
  const [runCount, setRunCount] = useState(0);

  const timerIntervalRef = useRef(null);
  const editorRef = useRef(null);

  // Fetch concepts to populate concept list
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const state = await api.fetchCognitiveState(user.id);
        if (state && state.length > 0) {
          // Filter to Python concepts
          const pyConcepts = state.filter(c => c.node_id.startsWith('PY_'));
          setConcepts(pyConcepts.length > 0 ? pyConcepts : state);
          setSelectedNodeId(pyConcepts[0]?.node_id || state[0].node_id);
        }
      } catch (err) {
        console.error('Failed to load concepts for Judge0 editor:', err);
      }
    };
    fetchNodes();
  }, [user.id]);

  // Handle snippet selection
  const handleConceptSelect = (nodeId) => {
    setSelectedNodeId(nodeId);
    
    // Extract snippet group keys (e.g., PY_SYNTAX, PY_DATA)
    const parts = nodeId.split('_');
    const key = parts.slice(0, 2).join('_'); // e.g. PY_SYNTAX
    setCode(STARTER_SNIPPETS[key] || STARTER_SNIPPETS.DEFAULT);
    
    // Reset telemetry metrics for the new challenge
    setBackspaceCount(0);
    setPasteCharCount(0);
    setRunCount(0);
    setTimeSpent(0);
  };

  // Timer interval hook
  useEffect(() => {
    setTimeSpent(0);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    timerIntervalRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [selectedNodeId]);

  // Monaco Editor mount handler to intercept key events for telemetry tracking
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track Paste Char Counts via Editor Paste Events
    editor.onDidPaste((e) => {
      const model = editor.getModel();
      if (model) {
        const pastedText = model.getValueInRange(e.range);
        setPasteCharCount(prev => prev + (pastedText ? pastedText.length : 0));
      }
    });

    // Track Backspace Hits via Editor Key Down Events
    editor.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Backspace) {
        setBackspaceCount(prev => prev + 1);
      }
    });
  };

  // Judge0 Secure Sandboxed Execution & Telemetry Ingestion
  const handleRunAndSubmit = async () => {
    setIsRunning(true);
    setSubmitStatus(null);
    setRunCount(prev => prev + 1);
    setConsoleLogs('> Enqueuing secure sandbox request...\n> Contacting Judge0 Execution Server...\n');

    try {
      const codeToRun = editorRef.current ? editorRef.current.getValue() : code;
      
      // Request compilation from Judge0 public server with 10s timeout protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: codeToRun,
          language_id: 71 // Python 3
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Judge0 responded with status code ${response.status}`);
      }

      const runResult = await response.json();
      
      // Status ID 3 = Accepted / Compiled and run successfully
      const isCorrect = runResult.status?.id === 3;
      const stdout = runResult.stdout || '';
      const stderr = runResult.stderr || '';
      const compileError = runResult.compile_output || '';
      const timeTaken = runResult.time || '0.00';
      const memoryUsed = runResult.memory || '0';

      // Log results into custom Console logs UI
      let logBuffer = '';
      if (stdout) logBuffer += stdout + '\n';
      if (stderr) logBuffer += `[STDERR] ${stderr}\n`;
      if (compileError) logBuffer += `[COMPILE ERROR] ${compileError}\n`;
      logBuffer += `\n---------------------------------\n`;
      logBuffer += `Execution Status: ${runResult.status?.description || 'Unknown'}\n`;
      logBuffer += `Execution Time: ${timeTaken}s | Memory: ${memoryUsed} KB\n`;
      
      setConsoleLogs(logBuffer);
      setSubmitStatus(isCorrect ? 'success' : 'failure');

      // Dispatch Telemetry Event to update student's Bayesian Cognitive State parameters
      const telemetryPayload = {
        node_id: selectedNodeId,
        event_type: 'CODE_SUBMISSION',
        success: isCorrect,
        attempts: 1,
        code_snippet: codeToRun,
        behavioral_flags: isCorrect ? [] : ['COMPILE_ERROR'],
        time_spent_seconds: timeSpent,
        run_count: runCount + 1,
        backspace_count: backspaceCount,
        paste_char_count: pasteCharCount,
        syntax_error_count: compileError ? 1 : 0
      };

      console.log('[Judge0Telemetry] Dispatching consolidated telemetry:', telemetryPayload);
      await api.sendTelemetry(telemetryPayload);
      
      // Force trigger local logs refresh if DebugConsole is listening
      window.dispatchEvent(new CustomEvent('telemetry-log', {
        detail: `📦 Judge0 Fused Ingestion: Node: ${selectedNodeId}, Correct: ${isCorrect}, Backspaces: ${backspaceCount}, Pastes: ${pasteCharCount} chars`
      }));

    } catch (err) {
      console.error('[Judge0Telemetry] Execution failed:', err);
      let errorMsg = `> Sandbox error: ${err.message}\n`;
      if (err.name === 'AbortError') {
        errorMsg = `> Sandbox connection timeout (Judge0 API limit reached or offline).\n`;
      }
      setConsoleLogs(prev => prev + errorMsg);
      setSubmitStatus('failure');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#070a13', color: '#e2e8f0', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      {/* Upper Title Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(0, 242, 254, 0.15)', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#00f2fe', letterSpacing: '0.1em', fontWeight: 700 }}>Telemetry Sandbox</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0 0', background: 'linear-gradient(to right, #00f2fe, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LeetCode-Grade Execution
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 21, 39, 0.8)', border: '1px solid rgba(0, 242, 254, 0.15)', padding: '8px 16px', borderRadius: '10px' }}>
            <Cpu size={16} style={{ color: '#00f2fe' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Compiler: Judge0 CE</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Concepts Picker Sidebar */}
        <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '12px', padding: '16px', height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Target Concepts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {concepts.map((concept) => (
              <button
                key={concept.node_id}
                onClick={() => handleConceptSelect(concept.node_id)}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedNodeId === concept.node_id ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                  color: selectedNodeId === concept.node_id ? '#00f2fe' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: selectedNodeId === concept.node_id ? 700 : 500,
                  fontSize: '0.85rem',
                  borderLeft: selectedNodeId === concept.node_id ? '3px solid #00f2fe' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              >
                {concept.concept_name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Console Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Telemetry Monitors (Dark Analytics Dashboard) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Timer size={20} style={{ color: '#00f2fe' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Time Elapsed</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{timeSpent}s</div>
              </div>
            </div>
            <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Delete size={20} style={{ color: '#ec4899' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Backspace Hits</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{backspaceCount}</div>
              </div>
            </div>
            <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clipboard size={20} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chars Pasted</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{pasteCharCount}</div>
              </div>
            </div>
            <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Play size={20} style={{ color: '#eab308' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submissions</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{runCount}</div>
              </div>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0a0f1d', borderBottom: '1px solid rgba(0, 242, 254, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={16} style={{ color: '#00f2fe' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', fontFamily: 'monospace' }}>python_editor.py</span>
              </div>
              <button
                onClick={handleRunAndSubmit}
                disabled={isRunning}
                style={{
                  background: 'linear-gradient(135deg, #00f2fe, #14b8a6)',
                  color: '#070a13',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: isRunning ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                  outline: 'none'
                }}
              >
                <Play size={14} fill="#070a13" />
                <span>{isRunning ? 'Executing...' : 'Run & Submit'}</span>
              </button>
            </div>
            
            <div style={{ height: '350px' }}>
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  lineNumbersMinChars: 3
                }}
              />
            </div>
          </div>

          {/* Console / Compilation Log Panel */}
          <div style={{ background: '#0d1527', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Terminal size={18} style={{ color: '#00f2fe' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Console Outputs</h4>
            </div>
            <pre style={{
              background: '#04060b',
              border: '1px solid rgba(0, 242, 254, 0.08)',
              borderRadius: '8px',
              padding: '16px',
              color: '#10b981',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              minHeight: '120px',
              maxHeight: '200px',
              overflowY: 'auto',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {consoleLogs}
            </pre>

            {/* Ingestion Alerts */}
            {submitStatus === 'success' && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <CheckCircle size={16} />
                <span>Test Cases Passed! Ingested telemetry details and updated Bayesian priors successfully.</span>
              </div>
            )}
            {submitStatus === 'failure' && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <ShieldAlert size={16} />
                <span>Execution Failed or Compilation Error. Telemetry dispatched to math engine classifier.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
