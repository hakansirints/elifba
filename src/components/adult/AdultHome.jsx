import React from 'react';
import BookReader from './BookReader';
import CurriculumView from './CurriculumView';
import PracticeCenter from './PracticeCenter';
import VideoGallery from './VideoGallery';

export default function AdultHome({
  activeTab = 'book',
  pagesData,
  currentPage,
  setCurrentPage,
  onOpenVideo,
  lang = 'tr'
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800">
      {activeTab === 'book' && (
        <BookReader
          pagesData={pagesData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onOpenVideo={onOpenVideo}
          lang={lang}
        />
      )}
      {activeTab === 'curriculum' && (
        <CurriculumView
          onJumpToPage={(p) => {
            setCurrentPage(p);
            // Parent switches to 'book' tab
          }}
          onOpenVideo={onOpenVideo}
          lang={lang}
        />
      )}
      {activeTab === 'practice' && (
        <PracticeCenter
          lang={lang}
          onOpenVideo={onOpenVideo}
          onJumpToPage={(p) => {
            setCurrentPage(p);
          }}
        />
      )}
      {activeTab === 'videos' && (
        <VideoGallery
          onOpenVideo={onOpenVideo}
          onJumpToPage={(p) => {
            setCurrentPage(p);
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
