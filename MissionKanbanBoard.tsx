// components/MissionKanbanBoard.tsx
"use client";

import { useState } from "react";
import type { KanbanColumn, MissionTask } from "@/types/missionWork";

interface MissionKanbanBoardProps {
  initialTasks: MissionTask[];
  onTasksChange?: (tasks: MissionTask[]) => void;
}

const COLUMNS: { value: KanbanColumn; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Under Review" },
];

const COLUMN_ACCENTS: Record<KanbanColumn, string> = {
  todo: "border-oak/20",
  "in-progress": "border-brass/50",
  review: "border-rank-b/50",
};

export default function MissionKanbanBoard({
  initialTasks,
  onTasksChange,
}: MissionKanbanBoardProps) {
  const [tasks, setTasks] = useState<MissionTask[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function updateTasks(next: MissionTask[]) {
    setTasks(next);
    onTasksChange?.(next);
  }

  function moveTask(taskId: string, column: KanbanColumn) {
    updateTasks(tasks.map((task) => (task.id === taskId ? { ...task, column } : task)));
  }

  function handleAddTask() {
    const title = newTaskTitle.trim();
    if (!title) return;
    const task: MissionTask = {
      id: `task-${Date.now()}`,
      title,
      column: "todo",
    };
    updateTasks([task, ...tasks]);
    setNewTaskTitle("");
  }

  function handleDrop(column: KanbanColumn) {
    if (draggedTaskId) {
      moveTask(draggedTaskId, column);
      setDraggedTaskId(null);
    }
  }

  // Column order drives which arrow buttons a card shows (mobile/no-DnD fallback).
  const columnOrder = COLUMNS.map((c) => c.value);

  return (
    <div className="rounded-sm border border-parchment-shadow/60 bg-parchment/90 p-5 shadow-plank">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-oak-dark">
          Progress Board
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a task..."
            className="rounded-sm border border-oak/20 bg-parchment px-3 py-1.5 font-body text-sm text-oak-dark placeholder:text-oak/40 focus:border-oak/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddTask}
            className="rounded-sm bg-oak px-3 py-1.5 font-display text-sm font-semibold text-parchment shadow-sm transition hover:bg-oak-light active:translate-y-px"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.column === column.value);
          const columnIndex = columnOrder.indexOf(column.value);

          return (
            <div
              key={column.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.value)}
              className={`min-h-[240px] rounded-sm border-t-4 bg-parchment-dark/30 p-3 ${COLUMN_ACCENTS[column.value]}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-oak-dark">
                  {column.label}
                </span>
                <span className="rounded-full bg-oak/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-oak/60">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDragEnd={() => setDraggedTaskId(null)}
                    className="cursor-grab rounded-sm border border-parchment-shadow/60 bg-parchment p-3 shadow-sm transition active:cursor-grabbing"
                  >
                    <p className="font-body text-sm text-oak-dark">{task.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={columnIndex === 0}
                        onClick={() => moveTask(task.id, columnOrder[columnIndex - 1])}
                        className="font-body text-xs text-oak/50 hover:text-oak disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        disabled={columnIndex === columnOrder.length - 1}
                        onClick={() => moveTask(task.id, columnOrder[columnIndex + 1])}
                        className="font-body text-xs text-oak/50 hover:text-oak disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Forward →
                      </button>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <p className="py-6 text-center font-body text-xs italic text-oak/40">
                    No tasks here
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
