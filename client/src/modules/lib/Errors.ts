import { events } from "./Events"

export interface IError {
  message: string
}

class Errors {

  add(errors: IError[]) {

    errors.forEach(({ message }) => {
      switch (message) {
        case 'Session not active.':
          events.publish('userStore.token.error', { message })
          break;
        default:
          break;
      }
    })
  }
}

export const errors = new Errors()