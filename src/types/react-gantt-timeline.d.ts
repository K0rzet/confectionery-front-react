declare module 'react-gantt-timeline' {
  export interface TimelineItem {
    id: string;
    start: number;
    end: number;
    name: string;
    groupName?: string;
    [key: string]: any;
  }

  export interface TimelineGroup {
    id: string;
    title: string;
    [key: string]: any;
  }

  export interface TimelineProps {
    data: TimelineItem[];
    groups?: TimelineGroup[];
    startTime: number;
    endTime: number;
    minZoom?: number;
    maxZoom?: number;
    rowHeight?: number;
    itemHeight?: number;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  }

  const Timeline: React.FC<TimelineProps>;
  export default Timeline;
} 