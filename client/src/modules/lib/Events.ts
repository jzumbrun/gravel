type TEventListener = (this: HTMLElement, e: CustomEvent<IEvent>) => void

export interface IEvent {
  message: string
}

class Events {

  subscribe(type: string, listener: TEventListener): () => void {
    document.addEventListener(type, listener)
    return () => this.unsubscribe(type, listener)
  }

  publish(type: string, detail: IEvent) {
    document.dispatchEvent(new CustomEvent<IEvent>(type, { detail }))
  }

  unsubscribe(type: string, listener: TEventListener) {
    document.removeEventListener(type, listener)
  }

}

export const events = new Events()