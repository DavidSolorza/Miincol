import type { AppEventMap, EventCallback, EventTopic, ServiceBusSubscription } from './bus.types';

class ServiceBusCore {
  private subscribers = new Map<string, Map<string, EventCallback<any>>>();
  private subCounter = 0;

  public subscribe<K extends EventTopic>(
    topic: K,
    callback: EventCallback<AppEventMap[K]>
  ): ServiceBusSubscription {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Map());
    }
    const id = `sub_${++this.subCounter}_${Date.now()}`;
    const topicSubs = this.subscribers.get(topic)!;
    topicSubs.set(id, callback);

    return {
      id,
      topic,
      unsubscribe: () => {
        topicSubs.delete(id);
        if (topicSubs.size === 0) this.subscribers.delete(topic);
      },
    };
  }

  public subscribeOnce<K extends EventTopic>(
    topic: K,
    callback: EventCallback<AppEventMap[K]>
  ): ServiceBusSubscription {
    const sub = this.subscribe(topic, ((payload: AppEventMap[K]) => {
      sub.unsubscribe();
      callback(payload);
    }) as EventCallback<AppEventMap[K]>);
    return sub;
  }

  public publish<K extends EventTopic>(topic: K, payload: AppEventMap[K]): void {
    const topicSubs = this.subscribers.get(topic);
    if (!topicSubs || topicSubs.size === 0) return;

    // Execute in microtask queue for non-blocking UI fluidity
    queueMicrotask(() => {
      topicSubs.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[ServiceBus Error] topic '${topic}':`, err);
        }
      });
    });
  }

  public clear(): void {
    this.subscribers.clear();
  }
}

export const serviceBus = new ServiceBusCore();
