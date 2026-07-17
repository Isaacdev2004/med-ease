import type {
  RadiologyStudy,
  ImagingSeries,
  ImagingInstance,
} from '@/services/radiology/types';
import type { ImageViewerState } from '@/services/radiology/types';

/** Default viewer state — replace with OHIF/Cornerstone adapter. */
export function createDefaultViewerState(
  study: RadiologyStudy,
): ImageViewerState {
  const firstSeries = study.series[0];
  const firstInstance = firstSeries?.instances[0];
  return {
    studyId: study.id,
    activeSeriesId: firstSeries?.id ?? '',
    activeInstanceId: firstInstance?.id ?? '',
    layout: '1x1',
    zoom: 1,
    pan: { x: 0, y: 0 },
    rotation: 0,
    invert: false,
    windowCenter: 40,
    windowWidth: 400,
  };
}

export function getSeriesById(
  study: RadiologyStudy,
  seriesId: string,
): ImagingSeries | undefined {
  return study.series.find((s) => s.id === seriesId);
}

export function getInstanceById(
  study: RadiologyStudy,
  instanceId: string,
): ImagingInstance | undefined {
  for (const series of study.series) {
    const inst = series.instances.find((i) => i.id === instanceId);
    if (inst) return inst;
  }
  return undefined;
}

export type ViewerEngine = 'placeholder' | 'ohif' | 'cornerstone';

export const VIEWER_ENGINE: ViewerEngine = 'placeholder';
