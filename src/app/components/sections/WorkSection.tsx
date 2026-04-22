import { motion } from 'motion/react';
import { ArrowRight, GripVertical, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../../lib/auth';
import { useProjects, type Project } from '../../lib/projects';
import { EditableText } from '../admin/EditableText';

export function WorkSection() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { projects, addProject, removeProject, reorderProjects } = useProjects();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = async () => {
    try {
      const created = await addProject({ title: 'New Project', subtitle: '프로젝트 설명' });
      navigate(created.path);
    } catch (err) {
      alert('추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemove = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 목록에서 삭제할까요?`)) return;
    try {
      await removeProject(id);
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    try {
      await reorderProjects(oldIdx, newIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const renderedProjects = projects.map((project, index) => (
    <ProjectRowContainer
      key={project.id}
      project={project}
      index={index}
      total={projects.length}
      isAdmin={isAdmin}
      delay={0.1 * index}
      onOpen={() => navigate(project.path)}
      onRemove={() => handleRemove(project.id, project.title)}
    />
  ));

  return (
    <section
      id="work"
      className="relative w-full min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 lg:mb-20"
      >
        <EditableText
          contentKey="section.work.heading"
          defaultValue="Selected Works"
          as="h2"
          className="text-[#1A1A1A] block"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.1em',
          }}
        />
      </motion.div>

      <motion.div
        className="max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {isAdmin ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {renderedProjects}
            </SortableContext>
          </DndContext>
        ) : (
          renderedProjects
        )}
        {isAdmin && (
          <motion.button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-3 py-8 md:py-10 border-b border-dashed border-[#DDDDDD] text-[#999999] hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            <Plus size={16} />
            <span>프로젝트 추가</span>
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}

interface ProjectRowContainerProps {
  project: Project;
  index: number;
  total: number;
  isAdmin: boolean;
  delay: number;
  onOpen: () => void;
  onRemove: () => void;
}

function ProjectRowContainer({
  project,
  isAdmin,
  delay,
  onOpen,
  onRemove,
}: ProjectRowContainerProps) {
  const k = `projects.${project.id}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: !isAdmin });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={sortableStyle}
      className="group relative cursor-pointer border-b border-[#EEEEEE] py-6 md:py-8 px-2 md:px-6 transition-all duration-300 hover:bg-[#F9F9F9]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={isAdmin ? undefined : onOpen}
      {...attributes}
    >
      <div className="flex items-center justify-between gap-4 md:gap-8">
        {isAdmin && (
          <button
            type="button"
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 text-[#BBBBBB] hover:text-[#0057FF] transition-colors"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            aria-label="드래그로 순서 변경"
            title="드래그로 순서 변경"
          >
            <GripVertical size={18} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <EditableText
            contentKey={`${k}.category`}
            defaultValue={project.category}
            as="p"
            className="text-[#999999] mb-1 md:mb-2"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          />
          <EditableText
            contentKey={`${k}.title`}
            defaultValue={project.title}
            as="h3"
            className="text-[#1A1A1A] mb-1 md:mb-2 text-[16px] md:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          />
          <EditableText
            contentKey={`${k}.subtitle`}
            defaultValue={project.subtitle}
            as="p"
            className="text-[#666666] text-[12px] md:text-[14px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          />
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onOpen}
                className="px-3 py-1.5 text-[#1A1A1A] border border-[#DDDDDD] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                }}
              >
                Open
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-[#999999] hover:text-[#D00] transition-colors"
                aria-label="삭제"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3 text-[#1A1A1A] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                }}
              >
                View Project
              </span>
              <ArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                size={20}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
