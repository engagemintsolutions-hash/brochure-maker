'use client';

import { Toolbar } from './toolbar';
import { PageNavigator } from './page-navigator';
import { CanvasPage } from './canvas-page';
import { PropertiesPanel } from './properties-panel';
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal';
import { ContextMenu } from './context-menu';

export function CanvasEditor() {
  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <PageNavigator />
        <div className="flex-1 overflow-auto bg-gray-200">
          <CanvasPage />
        </div>
        <PropertiesPanel />
      </div>
      <KeyboardShortcutsModal />
      <ContextMenu />
    </div>
  );
}
