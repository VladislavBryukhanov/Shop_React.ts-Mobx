import SocketIOClient from 'socket.io-client';
import moment from 'moment';
import rootStore from './rootStore';
import { IPagingQuery } from '../types/pagingQuery';
import { IMessage } from '../types/message';
import { observable, runInAction } from 'mobx';

const chatActions = {
  OPEN_CHAT: 'open_chat',
  CHAT_OPENED: 'chat_opened',
  ERROR: 'error'
};

const messageActions = {
  MESSAGE_SENT: 'message_sent',
  SEND_MESSAGE: 'send_message',
  MESSAGES_FETCHED: 'messages_fetched',
  FETCH_MESSAGES: 'fetch_messages'
};

export class  ChatStore {
  @observable
  messages: IMessage[] = [];

  socket!: SocketIOClient.Socket;

  initConnection() {
    this.socket = SocketIOClient(`${process.env.REACT_APP_CORE_API}`);
    this.socket.on(chatActions.ERROR, (err: ErrorEvent) => {
      console.error(err);
      // rootStore.errorHandler(err, 'ChatSocket');
    })
  }

  openChat(interlocutorId?: number) {
    this.socket.emit(chatActions.OPEN_CHAT, interlocutorId);

    return new Promise((resolve, reject) => {
      this.socket.on(chatActions.CHAT_OPENED, () => {
        resolve();
      });
    });
  }

  fetchMessages(paging?: IPagingQuery) {
    this.socket.on(messageActions.MESSAGE_SENT, (message: IMessage) => runInAction(
      () => { this.messages.push(message); }
    ));
    this.socket.on(messageActions.MESSAGES_FETCHED, (messages: IMessage[]) => runInAction(
      () => { this.messages = messages; }
    ));
    this.socket.emit(messageActions.FETCH_MESSAGES, paging);
  }

  sendMessage(messageContent: string) {
    this.socket.emit(messageActions.SEND_MESSAGE, {
      textContent: messageContent,
      timestamp: moment()
    });
  }
  
  closeConnection() {
    this.socket.disconnect();
  }
}

export default new ChatStore();
