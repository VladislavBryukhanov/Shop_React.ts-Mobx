import io from 'socket.io-client';
import moment from 'moment';
import rootStore from './rootStore';
import { IPagingQuery } from '../types/pagingQuery';
import { IMessage } from './../types/message';
import { observable, runInAction } from 'mobx';

let socket: any;

export class  ChatStore {
  @observable
  messages: IMessage[] = [];

  initConnection() {
    socket = io(`${process.env.REACT_APP_CORE_API}`);
    socket.on('error', (err: ErrorEvent) => {
      console.error(err);
      // rootStore.errorHandler(err, 'ChatSocket');
    })
  }

  openChat(interlocutorId?: number) {
    socket.emit('open_chat', interlocutorId);

    return new Promise((resolve, reject) => {
      socket.on('chat_opened', () => {
        resolve();
      });
    });
  }

  fetchMessages(paging?: IPagingQuery) {
    socket.on('message_sent', (message: IMessage) => runInAction(
      () => { this.messages.push(message); }
    ));
    socket.on('messages_fetched', (messages: IMessage[]) => runInAction(
      () => { this.messages = messages; }
    ));
    socket.emit('fetch_messages', paging);
  }

  sendMessage(messageContent: string) {
    socket.emit('send_message', {
      textContent: messageContent,
      timestamp: moment()
    });
  }
  
  closeConnection() {
    socket.disconnect();
  }
}

export default new ChatStore();