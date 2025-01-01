import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useAuth } from '../../AuthContext';
import { getUserDetails } from '../../api/admin';
import TextBlock from './components/TextBlock';
import ImageBlock from './components/ImageBlock';
import BlockToolbar from './components/BlockToolbar';
import { getPages, updatePage, createPage } from '../../api/pages';
import { checkPageLimit } from '../../api/subscription';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface Block {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

interface Page {
  id: string;
  title: string;
  blocks: Block[];
}

interface Error {
  message: string;
  type: string;
}

const SortableBlock = ({ block, onDelete, onChange }: { 
  block: Block; 
  onDelete: (id: string) => void; 
  onChange: (id: string, newContent: string) => void; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center">
      <div 
        {...attributes} 
        {...listeners} 
        className="mr-2 cursor-move"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
        </svg>
      </div>
      <div className="flex-grow">
        {block.type === 'text' ? (
          <TextBlock
            id={block.id}
            initialContent={block.content}
            onChange={(content) => onChange(block.id, content)}
            onDelete={() => onDelete(block.id)}
          />
        ) : (
          <ImageBlock
            id={block.id}
            initialUrl={block.content}
            onChange={(url) => onChange(block.id, url)}
            onDelete={() => onDelete(block.id)}
          />
        )}
      </div>
    </div>
  );
};

const PageBuilder: React.FC = () => {
  const { userId, id } = useParams<{ userId: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchPageAndUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check page limit for the user
        if (userId) {
          const pageLimitResponse = await checkPageLimit(userId );
          console.log("pageLimitResponse",pageLimitResponse);
          
          if (!pageLimitResponse.canCreate) {
            // Save detailed error message in state
            setError({
              message: pageLimitResponse.message || 'Page limit reached. You cannot create more pages.',
              type: 'page-limit'
            });
            return;
          }
        }

        if (id !=='new') {
          const pages = await getPages(userId);
          const currentPage = pages.find((p: Page) => p.id === id);
          if (!currentPage) {
            setError({
              message: 'Page not found',
              type: 'page-not-found'
            });
            return;
          }
          setPage(currentPage);
        } else {
          setPage({
            id: 'new',
            title: 'Untitled Page',
            blocks: [],
          });
        }

        // Fetch user details if current user is admin
        if (user?.role === 'admin' && userId) {
          const details = await getUserDetails(userId);
          setUserDetails(details.user);
        }
      } catch (err) {
        setError({
          message: 'Failed to fetch page or user details',
          type: 'fetch-error'
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndUserDetails();
  }, [id, userId, user?.role]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (page) {
      setPage({ ...page, title: event.target.value });
    }
  };

  const handleAddBlock = (type: 'text' | 'image') => {
    if (page) {
      const newBlock: Block = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content: '',
        order: page.blocks.length,
      };
      setPage({
        ...page,
        blocks: [...page.blocks, newBlock],
      });
    }
  };

  const handleBlockChange = (blockId: string, content: string) => {
    if (page) {
      setPage({
        ...page,
        blocks: page.blocks.map((block) =>
          block.id === blockId ? { ...block, content } : block
        ),
      });
    }
  };

  const handleBlockDelete = (blockId: string) => {
    if (page) {
      setPage({
        ...page,
        blocks: page.blocks.filter((block) => block.id !== blockId),
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPage((page) => {
        if (!page) return null;
        const oldIndex = page.blocks.findIndex(
          (block) => block.id === active.id
        );
        const newIndex = page.blocks.findIndex((block) => block.id === over?.id);

        return {
          ...page,
          blocks: arrayMove(page.blocks, oldIndex, newIndex).map(
            (block, index) => ({
              ...block,
              order: index,
            })
          ),
        };
      });
    }
  };

  const handleSave = async () => {
    if (!page) return;

    try {
      setSaving(true);
      if (page.id === 'new') {
        const newPage = await createPage({userId: userId || '', ...page});
        navigate(`/page-builder/${userId}/${newPage.id}`);
        toast.success('page created successfully!');
      } else {
        await updatePage(page.id, {userId:userId || '', ...page});
        toast.success('page updated successfully!');
      }
    } catch (err) {
      setError({
        message: 'Failed to save page',
        type: 'save-error'
      });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderUserDetails = () => {
    if (!user || user.role !== 'admin' || !userDetails) return null;

    return (
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Editing page for: <span className="font-semibold text-gray-800 dark:text-white">{userDetails.username}</span>
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-danger mb-4">{error.message}</p>
          {error.type === 'page-limit' && (
            <div style={{ marginTop: '10px' }}>
              <Button onClick={() => navigate('/subscription')}>
                Upgrade Plan
              </Button>
              <Button onClick={() => navigate(`/pages/${userId}`)} style={{ marginLeft: '10px' }}>
                View Pages
              </Button>
            </div>
          )}
          {error.type !== 'page-limit' && (
            <button
              onClick={() => navigate('/pages')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Back to Pages
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Page Builder" />

      <div className="mb-4 flex items-center justify-between">
        <div>
          {renderUserDetails()}
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <label 
          htmlFor="pageTitle" 
          className="mb-2 block text-base font-bold text-gray-800 dark:text-white"
        >
          Page Title
        </label>
          <div className="flex flex-wrap items-center justify-between gap-4.5">
            <div className="flex flex-1">
            <input
              type="text"
              value={page?.title || ''}
              onChange={handleTitleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Page Title"
            />
            </div>

            <div className="flex gap-4.5">
              <button
                onClick={() => handleAddBlock('text')}
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
              >
                Add Text
              </button>
              <button
                onClick={() => handleAddBlock('image')}
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
              >
                Add Image
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex justify-center rounded bg-success px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={page?.blocks.map(block => block.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4.5">
                {page?.blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onDelete={handleBlockDelete}
                    onChange={handleBlockChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {page?.blocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Add blocks to start building your page</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PageBuilder;
