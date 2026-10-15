import { useEffect, useCallback } from 'react';
import { serviceBus } from './ServiceBus';
import type { AppEventMap, EventCallback, EventTopic } from './bus.types';

export function useServiceBusSubscriber<K extends EventTopic>(
  topic: K,
  callback: EventCallback<AppEventMap[K]>,
  deps: unknown[] = []
): void {
  useEffect(() => {
    const subscription = serviceBus.subscribe(topic, callback);
    return () => subscription.unsubscribe();
  }, [topic, ...deps]);
}

export function useServiceBusPublish() {
  return useCallback(
    <K extends EventTopic>(topic: K, payload: AppEventMap[K]) => {
      serviceBus.publish(topic, payload);
    },
    []
  );
}
