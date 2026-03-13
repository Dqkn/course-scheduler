# LLM Schedule Generator Feature 

## Overview
This module contains the experimental "AI Schedule Generator" feature designed for the Student UI. It allows students to upload their course assignment documents (Word, Excel, PDF), which are theoretically parsed by an LLM to generate conflict-free schedule options. 

## Previous Functionality
Previously, this was tightly coupled to `src/app/pages/StudentView.tsx`. It injected a tab view ("My Schedule" vs "AI Generator") directly into the student's dashboard. Clicking the "AI Generator" tab revealed a drag-and-drop file upload zone, handled simulated loading states, and outputted 3 mocked schedule option cards for the user to review. 

Because this feature was built ahead of the project lifecycle (before backend LLM integration is ready), it was extracted into this isolated module to keep the live application interface clean while preserving all the complex frontend states, styling, and mocked data for future use.

## How to Re-Enable Later
When the backend logic is ready, a front-end developer can quickly re-integrate this into the app:

**1. Import the Component**
Inside `src/app/pages/StudentView.tsx`, import the panel at the top:
```tsx
import { LlmScheduleGeneratorPanel } from '../modules/future-features/llm-schedule-generator/LlmScheduleGeneratorPanel';
```

**2. Add Tab State**
Add an `activeTab` state to `StudentView.tsx` to handle toggling between the views:
```tsx
const [activeTab, setActiveTab] = useState<'schedule' | 'generator'>('schedule');
```

**3. Inject Tab Triggers**
Inject the buttons below the Student's profile banner to let them switch tabs.

**4. Conditionally Render Component**
Wrap the current `StudentView` timeline grid in a condition, and render the newly imported panel if the `generator` tab is active:
```tsx
{activeTab === 'schedule' ? (
  <div className="flex flex-col flex-1">
     {/* Render the standard activeDay tabs and daily schedule cards here */}
  </div>
) : (
  <LlmScheduleGeneratorPanel />
)}
```
