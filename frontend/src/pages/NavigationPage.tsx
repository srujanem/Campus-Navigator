import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGraph, calculateRoute, getTimetable, getMaintenance, calculateMidpoint, agentQuery, getAnalytics } from '../services/api';
import { FloorPlanMap } from '../components/FloorPlanMap';
import { LiveCameraScanner } from '../components/LiveCameraScanner';
import {
    Navigation,
    MapPin,
    Map,
    Image as ImageIcon,
    Search,
    Volume2,
    VolumeX,
    Calendar,
    AlertTriangle,
    Accessibility,
    Sparkles,
    Flame,
    Droplets,
    ArrowUpCircle,
    Share2,
    Users,
    MessageSquare,
    Send,
    X,
    Moon,
    Sun,
    Globe,
    Check,
    ArrowUpDown,
    Building2,
    Activity,
    Layers,
    Compass
} from 'lucide-react';

const photoMap: Record<string, string> = {
    'room_309': '/photos/WhatsApp Image 2026-09-26 at 11.35.00 PM.jpeg',
    'corridor_3_e': '/photos/WhatsApp Image 2026-09-26 at 11.35.06 PM.jpeg',
    'stairs_b_3': '/photos/WhatsApp Image 2026-09-26 at 11.35.43 PM.jpeg',
};

type LangKey = 'en' | 'hi' | 'te' | 'ta';

const translations: Record<LangKey, Record<string, string>> = {
    en: {
        title: "Campus Navigator Route Navigation",
        subtitle: "Zero-hardware indoor positioning across 4 campus buildings. Turn-by-turn guidance and AI vision.",
        fromWhere: "From Where?",
        destination: "Destination",
        getDirections: "Get Directions",
        calculating: "Calculating Route...",
        fastestRoute: "Fastest Route",
        estTime: "Est. Walk Time",
        stepFree: "Step-Free (Elevator Only)",
        findNearest: "Find Nearest:",
        washroom: "Washroom",
        elevator: "Elevator",
        fireExt: "Fire Ext.",
        labs: "Labs",
        voiceNav: "Voice Guidance",
        stopVoice: "Stop Voice Guidance",
        shareRoute: "Share Route",
        sosEvacuate: "🚨 Emergency Evacuation",
        singleRoute: "Point-to-Point Route",
        meetFriend: "Meet-a-Friend Midpoint",
        upcomingClass: "Upcoming Class",
        navClass: "Navigate to Class",
        scanDoor: "Camera / QR Scan",
        friend1: "Your Location",
        friend2: "Friend's Location",
        findMidpoint: "Find Fair Meeting Spot",
        crowdHeatmap: "Crowd Density Heatmap"
    },
    hi: {
        title: "कैंपस 360 मार्ग नेविगेशन",
        subtitle: "4 कैंपस भवनों में शून्य-हार्डवेयर इनडोर मैपिंग। तुरंत स्थान प्राप्त करने के लिए कैमरा दरवाजे की ओर करें।",
        fromWhere: "कहाँ से?",
        destination: "कहाँ जाना है?",
        getDirections: "रास्ता दिखाएं",
        calculating: "मार्ग की गणना की जा रही है...",
        fastestRoute: "सबसे तेज़ रास्ता",
        estTime: "अनुमानित समय",
        stepFree: "लिफ्ट द्वारा (सीढ़ियाँ नहीं)",
        findNearest: "निकटतम खोजें:",
        washroom: "शौचालय",
        elevator: "लिफ्ट",
        fireExt: "अग्निशामक",
        labs: "प्रयोगशाला",
        voiceNav: "आवाज़ से निर्देश",
        stopVoice: "आवाज़ बंद करें",
        shareRoute: "मार्ग साझा करें",
        sosEvacuate: "🚨 आपातकालीन निकास",
        singleRoute: "सामान्य मार्ग",
        meetFriend: "मित्र से मिलें",
        upcomingClass: "आगामी कक्षा",
        navClass: "कक्षा में जाएं",
        scanDoor: "कैमरा / QR स्कैन",
        friend1: "आपका स्थान",
        friend2: "मित्र का स्थान",
        findMidpoint: "मिलने का स्थान खोजें",
        crowdHeatmap: "भीड़ घनत्व हीटमैप"
    },
    te: {
        title: "క్యాంపస్ 360 రూట్ నావిగేషన్",
        subtitle: "4 క్యాంపస్ భవనాల్లో జీరో-హార్డ్‌వేర్ ఇండోర్ మ్యాపింగ్. లొకేషన్ కోసం మీ కెమెరాను తలుపు గుర్తుపై చూపండి.",
        fromWhere: "ఎక్కడ నుండి?",
        destination: "చేరాల్సిన ప్రదేశం",
        getDirections: "దిశలను చూపించు",
        calculating: "మార్గాన్ని గణిస్తోంది...",
        fastestRoute: "వేగవంతమైన మార్గం",
        estTime: "నడక సమయం",
        stepFree: "మెట్లు లేనిది (లిఫ్ట్ మాత్రమే)",
        findNearest: "సమీపంలో వెతకండి:",
        washroom: "వాష్‌రూమ్",
        elevator: "లిఫ్ట్",
        fireExt: "అగ్నిమాపకం",
        labs: "ల్యాబ్స్",
        voiceNav: "వాయిస్ నావిగేషన్",
        stopVoice: "వాయిస్ ఆపు",
        shareRoute: "రూట్ షేర్ చేయండి",
        sosEvacuate: "🚨 అత్యవసర నిష్క్రమణ",
        singleRoute: "సాధారణ మార్గం",
        meetFriend: "స్నేహితుడిని కలవండి",
        upcomingClass: "రాబోయే తరగతి",
        navClass: "తరగతికి వెళ్లండి",
        scanDoor: "లైవ్ కెమెరా / QR స్కాన్",
        friend1: "మీ లొకేషన్",
        friend2: "స్నేహితుడి లొకేషన్",
        findMidpoint: "సమాన దూరం కనుగొను",
        crowdHeatmap: "రద్దీ సాంద్రత హీట్‌మ్యాప్"
    },
    ta: {
        title: "வளாகம் 360 வழிசெலுத்தல்",
        subtitle: "4 வளாக கட்டிடங்களில் வன்பொருள் இல்லாத உள்ளக வரைபடம். கதவு QR குறியீட்டை ஸ்கேன் செய்யவும்.",
        fromWhere: "எங்கிருந்து?",
        destination: "செல்ல வேண்டிய இடம்",
        getDirections: "வழிகளைக் காட்டு",
        calculating: "பாதையைக் கணக்கிடுகிறது...",
        fastestRoute: "விரைவான பாதை",
        estTime: "நடக்கும் நேரம்",
        stepFree: "மின்தூக்கி மட்டும்",
        findNearest: "அருகில் தேடு:",
        washroom: "கழிப்பறை",
        elevator: "மின்தூக்கி",
        fireExt: "தீயணைப்பான்",
        labs: "ஆய்வகங்கள்",
        voiceNav: "குரல் வழிகாட்டல்",
        stopVoice: "குரலை நிறுத்து",
        shareRoute: "பகிர்",
        sosEvacuate: "🚨 அவசர வெளியேற்றம்",
        singleRoute: "வழக்கமான பாதை",
        meetFriend: "நண்பரைச் சந்தியுங்கள்",
        upcomingClass: "அடுத்த வகுப்பு",
        navClass: "வகுப்பிற்குச் செல்",
        scanDoor: "கேமரா / QR ஸ்கேன்",
        friend1: "உங்கள் இடம்",
        friend2: "நண்பரின் இடம்",
        findMidpoint: "சந்திக்கும் இடம் காண்க",
        crowdHeatmap: "கூட்ட நெரிசல் வரைபடம்"
    }
};

const LocationSearchInput: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    nodes: any[];
    placeholder: string;
    isDark?: boolean;
}> = ({ label, icon, value, onChange, nodes, placeholder, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = nodes.filter(n =>
        n.name.toLowerCase().includes(value.toLowerCase()) ||
        n.id.toLowerCase().includes(value.toLowerCase()) ||
        (n.building && n.building.toLowerCase().includes(value.toLowerCase()))
    );

    return (
        <div className="relative" ref={wrapperRef}>
            {label && (
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                    {icon}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg shadow-xs text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                />
            </div>

            {isOpen && value && (
                <ul className={`absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-56 overflow-y-auto ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                    {filtered.length > 0 ? (
                        filtered.map(n => (
                            <li
                                key={n.id}
                                onClick={() => {
                                    onChange(n.name);
                                    setIsOpen(false);
                                }}
                                className={`px-3.5 py-2.5 text-xs cursor-pointer border-b last:border-0 flex items-center justify-between ${
                                    isDark ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-blue-50 hover:text-blue-700 border-slate-100'
                                }`}
                            >
                                <div>
                                    <span className="font-bold">{n.name}</span>
                                    <span className="text-[10px] text-slate-400 ml-1.5">
                                        ({n.building || 'Academic Block'} · Floor {n.floor})
                                    </span>
                                </div>
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                    {n.type}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-xs text-slate-500 text-center">
                            No locations found matching "{value}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export const NavigationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [nodes, setNodes] = useState<any[]>([]);
    const [rawGraph, setRawGraph] = useState<any>({ nodes: [], edges: [] });
    const [activeMapFloor, setActiveMapFloor] = useState<number>(0);
    const [buildingFilter, setBuildingFilter] = useState<string>('all');

    // Theme & Language
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [lang, setLang] = useState<LangKey>('en');
    const t = translations[lang] || translations.en;

    // Mode: 'single' vs 'meet'
    const [navMode, setNavMode] = useState<'single' | 'meet'>('single');

    // Single Route State
    const [startText, setStartText] = useState<string>('Main Gate');
    const [endText, setEndText] = useState<string>('AI Lab');

    // Meet a Friend State
    const [friend1Start, setFriend1Start] = useState<string>('Room 309 (Hostel)');
    const [friend2Start, setFriend2Start] = useState<string>('Room 101');
    const [midpointResult, setMidpointResult] = useState<any>(null);

    // Common Routing
    const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
    const [routeResult, setRouteResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Crowd Density Heatmap State
    const [showCrowdDensity, setShowCrowdDensity] = useState<boolean>(false);
    const [crowdDensityData, setCrowdDensityData] = useState<Record<string, string>>({});

    // Modals & Panels
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatQuery, setChatQuery] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'agent', text: string }>>([
        { role: 'agent', text: 'Hi! I am your Campus Navigator AI Assistant. Ask me how to reach any room, lab, library, or canteen!' }
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Timetable & Maintenance
    const [nextClass, setNextClass] = useState<any | null>(null);
    const [maintenanceAlert, setMaintenanceAlert] = useState<string>('');

    // Audio Voice
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        getGraph().then(data => {
            if (data && data.nodes) {
                setRawGraph(data);
                const locs = data.nodes.filter((n: any) =>
                    ['classroom', 'hostel_room', 'entrance', 'lab', 'stairs', 'lift', 'washroom', 'fire_extinguisher', 'room'].includes(n.type)
                );
                const sorted = locs.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setNodes(sorted);

                // Auto pre-populate if URL parameters provided (?start=room_309&end=room_104)
                const startParam = searchParams.get('start');
                const endParam = searchParams.get('end');
                let foundStart = '';
                let foundEnd = '';

                if (startParam) {
                    const matchedStart = sorted.find((n: any) => n.id === startParam || n.name.toLowerCase() === startParam.toLowerCase());
                    if (matchedStart) {
                        setStartText(matchedStart.name);
                        foundStart = matchedStart.name;
                        if (typeof matchedStart.floor === 'number') setActiveMapFloor(matchedStart.floor);
                    }
                }
                if (endParam) {
                    const matchedEnd = sorted.find((n: any) => n.id === endParam || n.name.toLowerCase() === endParam.toLowerCase());
                    if (matchedEnd) {
                        setEndText(matchedEnd.name);
                        foundEnd = matchedEnd.name;
                    }
                }

                // If both parameters were present, auto calculate route
                if (foundStart && foundEnd) {
                    executeRoute(foundStart, foundEnd);
                }
            }
        }).catch(err => {
            console.error("Failed to load graph", err);
            setError("Failed to connect to navigation engine.");
        });

        getAnalytics().then(a => {
            if (a && a.crowd_density) {
                setCrowdDensityData(a.crowd_density);
            }
        }).catch(console.warn);

        getTimetable().then(tt => {
            if (Array.isArray(tt) && tt.length > 0) setNextClass(tt[2] || tt[0]);
        }).catch(console.warn);

        getMaintenance().then(m => {
            if (m && m.alert) setMaintenanceAlert(m.alert);
        }).catch(console.warn);

        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, [searchParams]);

    // Single route calculation
    const executeRoute = async (startName: string, endName: string, isAccessible: boolean = accessibleOnly) => {
        if (!startName || !endName) {
            setError("Please specify both a starting location and a destination.");
            return;
        }

        setIsLoading(true);
        setError('');
        setRouteResult(null);
        setMidpointResult(null);

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        const startNode = nodes.find(n => n.name.toLowerCase() === startName.toLowerCase() || n.id.toLowerCase() === startName.toLowerCase());
        const endNode = nodes.find(n => n.name.toLowerCase() === endName.toLowerCase() || n.id.toLowerCase() === endName.toLowerCase());

        if (!startNode || !endNode) {
            setError(`Could not resolve location. Please select from suggestions.`);
            setIsLoading(false);
            return;
        }

        try {
            const data = await calculateRoute(startNode.id, endNode.id, isAccessible);
            setRouteResult(data);
            if (typeof endNode.floor === 'number') setActiveMapFloor(endNode.floor);
            if (data.maintenance_alert) setMaintenanceAlert(data.maintenance_alert);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to calculate route.");
        } finally {
            setIsLoading(false);
        }
    };

    // Swap locations
    const handleSwapLocations = () => {
        const temp = startText;
        setStartText(endText);
        setEndText(temp);
        if (endText && temp) {
            executeRoute(endText, temp);
        }
    };

    // Meet a friend calculation
    const handleCalculateMidpoint = async () => {
        setIsLoading(true);
        setError('');
        setRouteResult(null);
        setMidpointResult(null);

        const nodeA = nodes.find(n => n.name.toLowerCase() === friend1Start.toLowerCase() || n.id.toLowerCase() === friend1Start.toLowerCase());
        const nodeB = nodes.find(n => n.name.toLowerCase() === friend2Start.toLowerCase() || n.id.toLowerCase() === friend2Start.toLowerCase());

        if (!nodeA || !nodeB) {
            setError("Please choose valid locations for both friends.");
            setIsLoading(false);
            return;
        }

        try {
            const data = await calculateMidpoint(nodeA.id, nodeB.id);
            setMidpointResult(data);
            if (typeof data.floor === 'number') setActiveMapFloor(data.floor);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to find midpoint meeting location.");
        } finally {
            setIsLoading(false);
        }
    };

    // Emergency Evacuation SOS
    const handleSOSEvacuate = () => {
        const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase() || n.id.toLowerCase() === startText.toLowerCase());
        const exits = nodes.filter(n => n.type === 'stairs' || n.type === 'entrance');
        if (exits.length === 0) return;

        let targetExit = exits[0];
        if (startNode) {
            const sameFloorExits = exits.filter(e => e.floor === startNode.floor);
            if (sameFloorExits.length > 0) targetExit = sameFloorExits[0];
        }

        setEndText(targetExit.name);
        executeRoute(startText, targetExit.name, false);
    };

    // Amenities Finder
    const handleFindNearest = (targetType: string) => {
        const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase() || n.id.toLowerCase() === startText.toLowerCase());
        const matching = nodes.filter(n => n.type === targetType);
        if (matching.length === 0) return;

        let bestNode = matching[0];
        if (startNode) {
            const sameFloor = matching.filter(n => n.floor === startNode.floor);
            if (sameFloor.length > 0) bestNode = sameFloor[0];
        }

        setEndText(bestNode.name);
        executeRoute(startText, bestNode.name);
    };

    // Share Route Link / WhatsApp
    const handleShareRoute = () => {
        const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase());
        const endNode = nodes.find(n => n.name.toLowerCase() === endText.toLowerCase());
        const url = `${window.location.origin}/student?start=${encodeURIComponent(startNode?.id || startText)}&end=${encodeURIComponent(endNode?.id || endText)}`;

        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);

        const text = encodeURIComponent(`Campus Navigator Indoor Route from ${startText} to ${endText}: ${url}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    // Text to Speech
    const handleToggleSpeech = () => {
        if (!window.speechSynthesis) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const steps = routeResult?.instructions || [];
        if (steps.length === 0) return;

        const totalSteps = steps.map((s: any, i: number) => `Step ${i + 1}: ${s.instruction}`).join('. ');
        const speechText = `Starting route from ${startText} to ${endText}. Total distance is ${routeResult.distance} meters. ${totalSteps}. You have arrived at your destination.`;

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    // AI Chatbot Submit
    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatQuery.trim()) return;

        const userMsg = chatQuery;
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatQuery('');
        setIsChatLoading(true);

        try {
            const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase());
            const res = await agentQuery(userMsg, startNode?.id);
            setChatMessages(prev => [...prev, { role: 'agent', text: res.message }]);

            if (res.type === 'navigate' && res.destination_id) {
                const dest = nodes.find(n => n.id === res.destination_id);
                if (dest) {
                    setEndText(dest.name);
                    executeRoute(startText, dest.name);
                }
            }
        } catch {
            setChatMessages(prev => [...prev, { role: 'agent', text: 'Error connecting to Campus AI Agent.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Filter nodes by selected building for quick-selection
    const displayNodes = buildingFilter === 'all'
        ? nodes
        : nodes.filter(n => n.building === buildingFilter);

    // Calculate vertical elevation shift if start and end are on different floors
    const startNodeObj = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase() || n.id.toLowerCase() === startText.toLowerCase());
    const endNodeObj = nodes.find(n => n.name.toLowerCase() === endText.toLowerCase() || n.id.toLowerCase() === endText.toLowerCase());
    const floorShift = (startNodeObj && endNodeObj && typeof startNodeObj.floor === 'number' && typeof endNodeObj.floor === 'number')
        ? endNodeObj.floor - startNodeObj.floor
        : 0;

    return (
        <div className={`h-full overflow-y-auto flex flex-col items-center p-4 sm:p-6 pb-20 transition-colors ${
            isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}>

            {/* Live Camera Scanner Modal */}
            <LiveCameraScanner
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onDetected={(loc) => {
                    setStartText(loc);
                    if (endText) executeRoute(loc, endText);
                }}
                availableNodes={nodes}
            />

            {/* Top Toolbar: Dark Mode, Language Selector, SOS Evacuation */}
            <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                        }`}
                        title="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                        <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                    </button>

                    <div className="relative flex items-center">
                        <Globe size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as LangKey)}
                            className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                            }`}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                        </select>
                    </div>

                    {/* Crowd Density Heatmap Toggle */}
                    <button
                        onClick={() => setShowCrowdDensity(!showCrowdDensity)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                            showCrowdDensity
                                ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                                : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                        }`}
                        title="Toggle Crowd Density Heatmap"
                    >
                        <Activity size={13} className={showCrowdDensity ? "text-purple-600 animate-pulse" : "text-slate-400"} />
                        <span>{t.crowdHeatmap}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSOSEvacuate}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition animate-pulse"
                    >
                        <Flame size={14} /> {t.sosEvacuate}
                    </button>
                </div>
            </div>

            {/* Campus Advisory / Maintenance Banner */}
            {maintenanceAlert && (
                <div className="w-full max-w-4xl mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3 shadow-xs text-slate-900">
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                            Active Campus Advisory & Dynamic Hazard Reroute
                        </p>
                        <p className="text-xs text-amber-800 mt-0.5">{maintenanceAlert}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-4xl w-full text-center mb-5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.title}</h1>
                <p className={`text-xs mt-1 max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.subtitle}
                </p>
            </div>

            {/* Mode Switch: Single Route vs Meet a Friend */}
            <div className="w-full max-w-4xl flex border-b border-slate-200 mb-5">
                <button
                    onClick={() => setNavMode('single')}
                    className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                        navMode === 'single'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Navigation size={14} /> {t.singleRoute}
                </button>
                <button
                    onClick={() => setNavMode('meet')}
                    className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                        navMode === 'meet'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Users size={14} /> {t.meetFriend}
                </button>
            </div>

            {/* 1-Click "My Next Class" Timetable Card */}
            {navMode === 'single' && nextClass && (
                <div className={`w-full max-w-4xl border rounded-xl p-3.5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/80 border-blue-200'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded uppercase">
                                {t.upcomingClass} ({nextClass.time})
                            </span>
                            <p className="text-xs font-bold mt-0.5">
                                {nextClass.subject} · <span className="text-blue-600 font-extrabold">{nextClass.room}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEndText(nextClass.room);
                            executeRoute(startText, nextClass.room);
                        }}
                        className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                        <Navigation size={13} /> {t.navClass}
                    </button>
                </div>
            )}

            {/* Navigation Card Form */}
            <div className={`w-full max-w-4xl rounded-2xl shadow-sm border p-5 sm:p-6 mb-6 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
                {navMode === 'single' ? (
                    <>
                        {/* Building Quick Filters */}
                        <div className="mb-4 flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                                <Building2 size={12} /> Sector:
                            </span>
                            {[
                                { id: 'all', label: 'All Campus' },
                                { id: 'Academic Block A', label: 'Academic Block A' },
                                { id: 'Central Library', label: 'Central Library' },
                                { id: 'Campus Canteen', label: 'Food Court' },
                                { id: 'Hostel Block', label: 'Hostels' },
                            ].map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => setBuildingFilter(b.id)}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                                        buildingFilter === b.id
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input Columns with Swap Button */}
                        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                            {/* Origin */}
                            <div className="md:col-span-5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {t.fromWhere}
                                    </label>
                                    <button
                                        onClick={() => setIsCameraOpen(true)}
                                        className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium flex items-center gap-1 hover:bg-blue-100 transition border border-blue-200"
                                    >
                                        <ImageIcon size={11} /> {t.scanDoor}
                                    </button>
                                </div>
                                <LocationSearchInput
                                    label=""
                                    icon={<MapPin size={16} />}
                                    value={startText}
                                    onChange={setStartText}
                                    nodes={displayNodes}
                                    placeholder="e.g. Main Gate or Room 309"
                                    isDark={isDarkMode}
                                />
                            </div>

                            {/* Swap Button */}
                            <div className="md:col-span-1 flex justify-center py-1">
                                <button
                                    type="button"
                                    onClick={handleSwapLocations}
                                    className={`p-2 rounded-full border shadow-xs hover:scale-105 transition ${
                                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-blue-700'
                                    }`}
                                    title="Swap Origin & Destination"
                                >
                                    <ArrowUpDown size={15} />
                                </button>
                            </div>

                            {/* Destination */}
                            <div className="md:col-span-5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {t.destination}
                                    </label>
                                    <span className="text-[10px] text-slate-400">Class, Lab, Library</span>
                                </div>
                                <LocationSearchInput
                                    label=""
                                    icon={<Search size={16} className="text-blue-500" />}
                                    value={endText}
                                    onChange={setEndText}
                                    nodes={displayNodes}
                                    placeholder="e.g. AI Lab, Library, or Canteen"
                                    isDark={isDarkMode}
                                />
                            </div>
                        </div>

                        {/* Popular Quick Destination Chips */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Frequent:</span>
                            {[
                                { name: 'AI Lab', desc: 'F2' },
                                { name: 'Room 309 (Hostel)', desc: 'Hostel' },
                                { name: 'Central Library', desc: 'Library' },
                                { name: 'Campus Canteen', desc: 'Dining' },
                                { name: 'Room 101', desc: 'F1' },
                                { name: 'Hostel Dining Mess', desc: 'Mess' }
                            ].map(item => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setEndText(item.name);
                                        executeRoute(startText, item.name);
                                    }}
                                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition ${
                                        isDarkMode
                                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Quick Amenities & Accessibility Bar */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">{t.findNearest}</span>
                                <button
                                    onClick={() => handleFindNearest('washroom')}
                                    className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    <Droplets size={12} className="text-blue-500" /> {t.washroom}
                                </button>
                                <button
                                    onClick={() => handleFindNearest('lift')}
                                    className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    <ArrowUpCircle size={12} className="text-amber-500" /> {t.elevator}
                                </button>
                                <button
                                    onClick={() => handleFindNearest('fire_extinguisher')}
                                    className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    <Flame size={12} className="text-red-500" /> {t.fireExt}
                                </button>
                                <button
                                    onClick={() => handleFindNearest('lab')}
                                    className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    <Sparkles size={12} className="text-purple-500" /> {t.labs}
                                </button>
                            </div>

                            {/* Step-Free Accessibility Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                                <input
                                    type="checkbox"
                                    checked={accessibleOnly}
                                    onChange={(e) => {
                                        setAccessibleOnly(e.target.checked);
                                        if (startText && endText) executeRoute(startText, endText, e.target.checked);
                                    }}
                                    className="w-3.5 h-3.5 text-blue-600 rounded"
                                />
                                <span className="flex items-center gap-1 text-slate-500">
                                    <Accessibility size={13} className="text-blue-600" /> {t.stepFree}
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 flex items-center justify-between">
                            {routeResult && (
                                <button
                                    onClick={handleShareRoute}
                                    className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                                >
                                    {isCopied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                                    <span>{isCopied ? 'Link Copied!' : t.shareRoute}</span>
                                </button>
                            )}

                            <button
                                onClick={() => executeRoute(startText, endText)}
                                disabled={isLoading || !startText || !endText}
                                className="ml-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm disabled:opacity-50 transition flex items-center gap-2 text-xs"
                            >
                                <Navigation size={14} />
                                {isLoading ? t.calculating : t.getDirections}
                            </button>
                        </div>
                    </>
                ) : (
                    /* Meet a Friend Mode */
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <LocationSearchInput
                                label={t.friend1}
                                icon={<MapPin size={16} />}
                                value={friend1Start}
                                onChange={setFriend1Start}
                                nodes={nodes}
                                placeholder="e.g. Room 309 (Hostel)"
                                isDark={isDarkMode}
                            />
                            <LocationSearchInput
                                label={t.friend2}
                                icon={<Users size={16} className="text-blue-500" />}
                                value={friend2Start}
                                onChange={setFriend2Start}
                                nodes={nodes}
                                placeholder="e.g. Room 101 (Academic Block)"
                                isDark={isDarkMode}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleCalculateMidpoint}
                                disabled={isLoading || !friend1Start || !friend2Start}
                                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm disabled:opacity-50 transition flex items-center gap-2 text-xs"
                            >
                                <Users size={14} /> {isLoading ? 'Calculating Midpoint...' : t.findMidpoint}
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">
                        {error}
                    </div>
                )}
            </div>

            {/* Meet a Friend Midpoint Result Card */}
            {midpointResult && (
                <div className={`w-full max-w-4xl border rounded-2xl p-5 mb-5 shadow-sm space-y-4 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-200'
                }`}>
                    <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                                Optimal Fair Meeting Venue
                            </span>
                            <h2 className="text-xl font-bold mt-1 text-blue-600">
                                {midpointResult.midpoint_name} (Floor {midpointResult.floor})
                            </h2>
                        </div>
                        <Users size={24} className="text-blue-600" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="font-bold text-slate-800">{friend1Start}</p>
                            <p className="text-slate-500 mt-1">
                                Distance: <span className="font-semibold text-slate-900">{midpointResult.student_a?.distance}m</span> ({midpointResult.student_a?.estimated_time_seconds}s walk)
                            </p>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="font-bold text-slate-800">{friend2Start}</p>
                            <p className="text-slate-500 mt-1">
                                Distance: <span className="font-semibold text-slate-900">{midpointResult.student_b?.distance}m</span> ({midpointResult.student_b?.estimated_time_seconds}s walk)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Route Results Area */}
            {routeResult && routeResult.instructions && (
                <div className="w-full max-w-4xl space-y-5">
                    {/* Summary Card with Voice Reader */}
                    <div className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t.fastestRoute}</p>
                                <p className="text-xl font-black mt-0.5 text-blue-600">{routeResult.distance || 0} meters</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t.estTime}</p>
                                <p className="text-xl font-black mt-0.5">{routeResult.estimated_time_seconds || 0} seconds</p>
                            </div>
                            {floorShift !== 0 && (
                                <>
                                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vertical Shift</p>
                                        <p className="text-xs font-bold mt-1 text-amber-600 flex items-center gap-1">
                                            <ArrowUpCircle size={14} />
                                            {floorShift > 0 ? `+${floorShift} Floors Up` : `${floorShift} Floors Down`}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleToggleSpeech}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                                isSpeaking
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                        >
                            {isSpeaking ? (
                                <>
                                    <VolumeX size={15} className="text-amber-700 animate-pulse" /> {t.stopVoice}
                                </>
                            ) : (
                                <>
                                    <Volume2 size={15} className="text-blue-600" /> {t.voiceNav}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Visual 2D Map Container */}
                    <div className={`border rounded-2xl overflow-hidden shadow-sm ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                        <div className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
                            isDarkMode ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center gap-2">
                                <Compass size={16} className="text-blue-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Live Campus Spatial Map</h3>
                                {showCrowdDensity && (
                                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                        Heatmap Layer Active
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                                {[0, 1, 2, 3].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveMapFloor(f)}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                                            activeMapFloor === f
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}
                                    >
                                        {f === 0 ? 'Ground' : `Floor ${f}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`p-4 sm:p-5 flex justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                            <FloorPlanMap
                                graphData={rawGraph}
                                currentFloor={activeMapFloor}
                                path={routeResult.path || []}
                                startNode={routeResult.path?.[0]}
                                endNode={routeResult.path?.[routeResult.path?.length - 1]}
                                showCrowdDensity={showCrowdDensity}
                                crowdDensityData={crowdDensityData}
                            />
                        </div>
                    </div>

                    {/* Step-by-Step Directions */}
                    <div className={`border rounded-2xl overflow-hidden shadow-sm ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                        <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${
                            isDarkMode ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                            <MapPin size={16} className="text-blue-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Turn-by-Turn Navigation Instructions</h3>
                        </div>
                        
                        <div className="p-0 divide-y divide-slate-100">
                            {routeResult.instructions.map((step: any, idx: number) => {
                                const pathArray = routeResult.path || [];
                                const stepNodeId = step.node_id || pathArray[idx] || '';
                                const photoUrl = photoMap[stepNodeId];

                                return (
                                    <div key={idx} className="flex relative hover:bg-slate-50/50 transition-colors">
                                        <div className="w-14 flex flex-col items-center py-5 relative">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold z-10 shadow-xs">
                                                {idx + 1}
                                            </div>
                                            {idx !== routeResult.instructions.length - 1 && (
                                                <div className="absolute top-11 bottom-0 w-0.5 bg-slate-200" />
                                            )}
                                        </div>

                                        <div className="flex-1 py-5 pr-5">
                                            <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                {step.instruction || 'Continue along designated path'}
                                            </p>

                                            {photoUrl && (
                                                <div className="mt-3 border rounded-xl overflow-hidden relative max-w-md shadow-xs border-slate-300">
                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                                        <ImageIcon size={10} /> Real Corridor Sign View
                                                    </div>
                                                    <img
                                                        src={photoUrl}
                                                        alt={`View of ${stepNodeId}`}
                                                        className="w-full h-auto max-h-56 object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating AI Assistant Chatbot Bubble */}
            <div className="fixed bottom-5 right-5 z-40">
                {!isChatOpen ? (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
                        title="Open Campus AI Assistant"
                    >
                        <MessageSquare size={22} />
                    </button>
                ) : (
                    <div className="w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96 text-slate-900">
                        {/* Chat Header */}
                        <div className="px-4 py-3 bg-blue-700 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} />
                                <h4 className="text-xs font-bold">Campus Navigator AI Assistant</h4>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-1 text-blue-200 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                            {chatMessages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`p-2.5 rounded-xl max-w-[85%] ${
                                        m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="text-slate-400 italic text-[11px] p-2">AI is calculating route...</div>
                            )}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-200 flex gap-1.5 bg-slate-50">
                            <input
                                type="text"
                                value={chatQuery}
                                onChange={e => setChatQuery(e.target.value)}
                                placeholder="e.g. Where is Central Library?"
                                className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={isChatLoading || !chatQuery.trim()}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                            >
                                <Send size={13} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
