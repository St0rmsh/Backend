import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  setEditorState, 
  resetEditor, 
  setSavingStatus, 
  setLastSavedAt,
  setValidationErrors
} from '../state/postEditorSlice';
import { postEditorService } from '../services/postEditor.service';
import { TitleInput } from '../components/TitleInput';
import { CoverUploader } from '../components/CoverUploader';
import { MediaUploader } from '../components/MediaUploader';
import { EditorContent } from '../components/EditorContent';
import { PublishPanel } from '../components/PublishPanel';
import { DraftStatus } from '../components/DraftStatus';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/shared/utils/errorHandler';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.postEditor);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const previewUrls = useRef<string[]>([]);

  useEffect(() => {
    dispatch(resetEditor());
    return () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [dispatch]);

  const handlePublish = async (isPublished: boolean = true) => {
    if (!editorState.title.trim()) {
      dispatch(setValidationErrors({ title: 'Title is required' }));
      return;
    }
    if (!editorState.content.trim() || editorState.content === '<p></p>') {
      dispatch(setValidationErrors({ content: 'Content is required' }));
      return;
    }

    try {
      dispatch(setSavingStatus(true));
      dispatch(setEditorState({ isPublished })); // optimistically update local state

      const formData = new FormData();
      formData.append('title', editorState.title);
      formData.append('content', editorState.content);
      formData.append('category', editorState.category);
      if (editorState.tags.length > 0) {
        editorState.tags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));
      }
      formData.append('isPublished', String(isPublished));

      if (coverFile) {
        formData.append('coverImage', coverFile);
      }
      if (mediaFile) formData.append('media', mediaFile);

      const response = await postEditorService.createPost(formData);
      
      dispatch(setLastSavedAt(new Date().toISOString()));
      
      // Navigate to edit page to avoid creating new posts on subsequent saves
      if (response.data && response.data._id) {
        navigate(`/posts/edit/${response.data._id}`, { replace: true });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to create post', error);
      toast.error(handleApiError(error, 'Unable to create post. Check your media and try again.'));
    } finally {
      dispatch(setSavingStatus(false));
    }
  };

  return (
    <div className="min-h-screen bg-background/80 pt-20 pb-12 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <DraftStatus />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Editor Area */}
          <div className="flex-1 max-w-4xl">
            <CoverUploader 
              coverImage={editorState.coverImage}
              onUpload={(file) => {
                setCoverFile(file);
                const objectUrl = URL.createObjectURL(file);
                previewUrls.current.push(objectUrl);
                dispatch(setEditorState({ coverImage: objectUrl }));
              }}
              onRemove={() => {
                if (editorState.coverImage?.startsWith('blob:')) URL.revokeObjectURL(editorState.coverImage);
                setCoverFile(null);
                dispatch(setEditorState({ coverImage: undefined }));
              }}
            />

            <MediaUploader
              mediaUrl={mediaPreview?.url}
              mediaType={mediaPreview?.type}
              onUpload={(file) => {
                if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
                setMediaFile(file);
                const objectUrl = URL.createObjectURL(file);
                previewUrls.current.push(objectUrl);
                setMediaPreview({ url: objectUrl, type: file.type.startsWith('video/') ? 'video' : 'image' });
              }}
              onRemove={() => {
                if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
                setMediaFile(null);
                setMediaPreview(null);
              }}
            />

            <TitleInput 
              value={editorState.title} 
              onChange={(title) => dispatch(setEditorState({ title }))} 
            />
            {editorState.validationErrors.title && (
              <p className="text-red-500 text-sm mb-4">{editorState.validationErrors.title}</p>
            )}

            <EditorContent />
            {editorState.validationErrors.content && (
              <p className="text-red-500 text-sm mt-2">{editorState.validationErrors.content}</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <PublishPanel 
              onPublish={() => handlePublish(true)}
              onSaveDraft={() => handlePublish(false)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
