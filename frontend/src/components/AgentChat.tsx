import React, { useState } from 'react';
import { Send, MapPin } from 'lucide-react';
import { agentQuery } from '../services/api';

interface AgentChatProps {
    currentLocation?: string;
    onDestinationFound: (nodeId: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ currentLocation, onDestinationFound }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{role: 'user'|'agent', text: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setIsLoading(true);
        
        try {
            const res = await agentQuery(query, currentLocation);
            setMessages(prev => [...prev, { role: 'agent', text: res.message }]);
            if (res.type === 'navigate' && res.destination_id) {
                onDestinationFound(res.destination_id);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'agent', text: "Error connecting to Navigation Agent." }]);
        } finally {
            setIsLoading(false);
            setQuery('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-blue-50 flex items-center">
                <MapPin className="text-blue-600 mr-2" />
                <h2 className="font-semibold text-blue-900">AI Navigation Agent</h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                    <div className="text-gray-400 text-sm text-center mt-10">
                        Ask me to take you somewhere, find the nearest exit, or where your next class is!
                    </div>
                )}
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-lg max-w-[85%] ${
                            m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
