
import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget';

/**
 * App Component
 * 
 * This is the entry point for the embedded widget. 
 * It is designed to sit in the corner of the blog post at
 * https://nicholaspacl.com/from-devices-to-data-platforms.html
 */
const App: React.FC = () => {
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <div className="fixed bottom-0 right-0 p-6 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <ChatWidget 
          isOpen={isAgentOpen} 
          onToggle={() => setIsAgentOpen(!isAgentOpen)} 
        />
      </div>
    </div>
  );
};

export default App;
