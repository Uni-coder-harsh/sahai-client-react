import { useRef } from 'react';

/**
 * --- TASK 2: React (Vite) Telemetry Trackers ---
 * Custom React Hook for tracking user MCQ choices and response timing.
 * Uses `useRef` to prevent any UI re-renders during active tracking.
 */
export function useMCQTelemetry() {
  const startTime = useRef(Date.now());
  const firstActionTime = useRef(null);
  const optionSwitchCount = useRef(0);
  const lastClickTime = useRef(null);
  const minClickInterval = useRef(Infinity);

  const startMCQTracking = () => {
    startTime.current = Date.now();
    firstActionTime.current = null;
    optionSwitchCount.current = 0;
    lastClickTime.current = null;
    minClickInterval.current = Infinity;
  };

  const recordAction = () => {
    const now = Date.now();
    if (firstActionTime.current === null) {
      firstActionTime.current = now;
    }
    if (lastClickTime.current !== null) {
      const interval = now - lastClickTime.current;
      if (interval < minClickInterval.current) {
        minClickInterval.current = interval;
      }
    }
    lastClickTime.current = now;
  };

  const recordOptionSwitch = () => {
    recordAction();
    optionSwitchCount.current += 1;
  };

  const getMCQPayload = () => {
    const now = Date.now();
    const total_time_spent_sec = (now - startTime.current) / 1000;
    const time_to_first_action_sec = firstActionTime.current
      ? (firstActionTime.current - startTime.current) / 1000
      : total_time_spent_sec;
    const minimum_click_interval_ms = minClickInterval.current === Infinity ? 0 : minClickInterval.current;

    return {
      time_to_first_action_sec: parseFloat(time_to_first_action_sec.toFixed(3)),
      option_switch_count: optionSwitchCount.current,
      minimum_click_interval_ms: Math.round(minimum_click_interval_ms),
      total_time_spent_sec: parseFloat(total_time_spent_sec.toFixed(3))
    };
  };

  return { startMCQTracking, recordAction, recordOptionSwitch, getMCQPayload };
}

/**
 * Custom React Hook for tracking student behavior in the IDE/Sandbox coding environment.
 * Uses `useRef` to store metrics without triggering re-renders on keystrokes or runs.
 */
export function useCodeTelemetry() {
  const startTime = useRef(Date.now());
  const firstEditTime = useRef(null);
  const compileCount = useRef(0);
  const syntaxErrorCount = useRef(0);
  const pasteCharCount = useRef(0);
  const backspaceCount = useRef(0);

  const startCodeTracking = () => {
    startTime.current = Date.now();
    firstEditTime.current = null;
    compileCount.current = 0;
    syntaxErrorCount.current = 0;
    pasteCharCount.current = 0;
    backspaceCount.current = 0;
  };

  const recordEdit = () => {
    if (firstEditTime.current === null) {
      firstEditTime.current = Date.now();
    }
  };

  const recordBackspace = () => {
    recordEdit();
    backspaceCount.current += 1;
  };

  const recordPaste = (charCount) => {
    recordEdit();
    pasteCharCount.current += charCount;
  };

  const recordCompile = () => {
    compileCount.current += 1;
  };

  const recordSyntaxError = () => {
    syntaxErrorCount.current += 1;
  };

  const getCodePayload = () => {
    const now = Date.now();
    const time_to_first_edit_sec = firstEditTime.current
      ? (firstEditTime.current - startTime.current) / 1000
      : (now - startTime.current) / 1000;

    return {
      time_to_first_edit_sec: parseFloat(time_to_first_edit_sec.toFixed(3)),
      compile_count: compileCount.current,
      syntax_error_count: syntaxErrorCount.current,
      paste_char_count: pasteCharCount.current,
      backspace_count: backspaceCount.current
    };
  };

  return {
    startCodeTracking,
    recordEdit,
    recordBackspace,
    recordPaste,
    recordCompile,
    recordSyntaxError,
    getCodePayload
  };
}

/**
 * --- TASK 2.3: Ingestion Integration Example ---
 * Shows an example of wrapping these hooks and sending the payload to `/api/telemetry`
 * using Axios alongside answer submissions.
 *
 * import axios from 'axios';
 * import { useMCQTelemetry, useCodeTelemetry } from './telemetryHooks';
 *
 * function StudentSolverComponent({ questionId }) {
 *   const mcqTracker = useMCQTelemetry();
 *   const codeTracker = useCodeTelemetry();
 *
 *   const handleOptionClick = (optionId) => {
 *     // Record action and switch
 *     mcqTracker.recordOptionSwitch();
 *   };
 *
 *   const handleCodeChange = (e) => {
 *     codeTracker.recordEdit();
 *     if (e.nativeEvent.inputType === 'deleteContentBackward') {
 *       codeTracker.recordBackspace();
 *     }
 *   };
 *
 *   const handleSubmit = async () => {
 *     const mcqMetrics = mcqTracker.getMCQPayload();
 *     const codeMetrics = codeTracker.getCodePayload();
 *
 *     // Wrap metrics alongside details
 *     const telemetryPayload = {
 *       interaction_type: 'Code',
 *       metrics: {
 *         ...mcqMetrics,
 *         ...codeMetrics
 *       },
 *       question_id: questionId,
 *       success: true // evaluate correctness
 *     };
 *
 *     try {
 *       // Send asynchronously to Node Gateway
 *       const response = await axios.post('/api/telemetry', telemetryPayload, {
 *         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
 *       });
 *       console.log('Telemetry ingested. ID:', response.data.event_id);
 *     } catch (error) {
 *       console.error('Failed to submit telemetry:', error);
 *     }
 *   };
 * }
 */
