import React, { useState } from 'react';
import KidAdventureMap from './KidAdventureMap';
import KidLessonView from './KidLessonView';
import LetterGarden from './LetterGarden';
import BalloonPopGame from './BalloonPopGame';
import MemoryMatchGame from './MemoryMatchGame';
import VowelQuestGame from './VowelQuestGame';
import KidCinema from './KidCinema';

export default function KidHome({ 
  activeTab = 'map', 
  lang = 'tr', 
  onAddStar, 
  onOpenVideo 
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('kid_completed_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleMarkCompleted = (topicId) => {
    if (!completedTopics.includes(topicId)) {
      const next = [...completedTopics, topicId];
      setCompletedTopics(next);
      try {
        localStorage.setItem('kid_completed_topics', JSON.stringify(next));
      } catch {}
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FD] text-slate-800 pb-16">
      
      {/* 1. If in 'map' tab */}
      {activeTab === 'map' && (
        <>
          {selectedTopic ? (
            <KidLessonView
              topic={selectedTopic}
              onBack={() => setSelectedTopic(null)}
              lang={lang}
              onOpenVideo={onOpenVideo}
              onAddStar={onAddStar}
              isCompleted={completedTopics.includes(selectedTopic.id)}
              onMarkCompleted={handleMarkCompleted}
            />
          ) : (
            <KidAdventureMap
              onSelectTopic={(topic) => setSelectedTopic(topic)}
              completedTopics={completedTopics}
              lang={lang}
            />
          )}
        </>
      )}

      {/* 2. Standalone Kid Tabs */}
      {activeTab === 'garden' && (
        <LetterGarden lang={lang} onAddStar={onAddStar} />
      )}
      {activeTab === 'balloons' && (
        <BalloonPopGame lang={lang} onAddStar={onAddStar} />
      )}
      {activeTab === 'memory' && (
        <MemoryMatchGame lang={lang} onAddStar={onAddStar} />
      )}
      {activeTab === 'vowels' && (
        <VowelQuestGame lang={lang} onAddStar={onAddStar} />
      )}
      {activeTab === 'cinema' && (
        <KidCinema lang={lang} onOpenVideo={onOpenVideo} onAddStar={onAddStar} />
      )}

    </div>
  );
}
