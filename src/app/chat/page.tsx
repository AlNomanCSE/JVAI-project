'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hook';
import {
  useGetUserChatListQuery,
  useGetChatContentQuery,
  useCreateChatMutation,
  useAddMessageToChatMutation,
  useUpdateChatTitleMutation,
  useDeleteChatMutation,
  useLogoutMutation,
} from '@/lib/features/auth/authApi';
import { logout as logoutAction } from '@/lib/features/auth/authSlice';

export default function ChatPage() {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [modelName, setModelName] = useState('Chartwright');
  const [isRenamingChat, setIsRenamingChat] = useState<number | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');

  const { data: chatList, isLoading: isLoadingChats } = useGetUserChatListQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: chatContent, isLoading: isLoadingMessages } = useGetChatContentQuery(
    selectedChatId!,
    {
      skip: !selectedChatId,
    }
  );

  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const [addMessage, { isLoading: isSendingMessage }] = useAddMessageToChatMutation();
  const [updateChatTitle] = useUpdateChatTitleMutation();
  const [deleteChat] = useDeleteChatMutation();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push('/signin');
    }
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    console.log('===== CHAT LIST DEBUG =====');
    console.log('Full chatList:', JSON.stringify(chatList, null, 2));
    console.log('Is array?', Array.isArray(chatList));
    if (chatList) {
      console.log('Chat list length:', Array.isArray(chatList) ? chatList.length : 'Not an array');
    }
    console.log('============================');
  }, [chatList]);

  useEffect(() => {
    console.log('===== CHAT CONTENT DEBUG =====');
    console.log('Full chatContent:', JSON.stringify(chatContent, null, 2));
    console.log('chatContent exists?', !!chatContent);
    const messages = chatContent?.data?.messages || chatContent?.messages || [];
    console.log('Messages found:', messages.length);
    console.log('==============================');
  }, [chatContent]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (!selectedChatId) {
        const result = await createChat({
          model_name: modelName,
          message_content: message,
        }).unwrap();
        
        console.log('Create chat result:', result);
        // The ID is nested in result.data.id
        setSelectedChatId(result.data.id);
        setMessage('');
      } else {
        await addMessage({
          chat_id: selectedChatId,
          model_name: modelName,
          message_content: message,
        }).unwrap();

        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessage('');
  };

  const handleRenameChat = async (chatId: number) => {
    if (!newChatTitle.trim()) return;

    try {
      await updateChatTitle({ chatId, title: newChatTitle }).unwrap();
      setIsRenamingChat(null);
      setNewChatTitle('');
    } catch (error) {
      console.error('Failed to rename chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this chat? This action cannot be undone.');
    
    if (!confirmed) return;

    try {
      console.log('Deleting chat:', chatId);
      await deleteChat(chatId).unwrap();
      console.log('Chat deleted successfully');
      
      // If the deleted chat was selected, clear selection
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
      
      // Show success feedback (optional - you can add a toast notification here)
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logoutAction());
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">AI Healthcare</h1>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          
          {/* Model Selection */}
          <div className="grid grid-cols-2 gap-2">
            {['Chartwright', 'TranscriptX', 'Redactify', 'Validify'].map((model) => (
              <button
                key={model}
                onClick={() => setModelName(model)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  modelName === model
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <button
              onClick={handleNewChat}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>

          {isLoadingChats ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm">Loading chats...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Chat History</h2>
              {(() => {
                // Handle different API response structures
                const chats = chatList?.data || chatList || [];
                const chatArray = Array.isArray(chats) ? chats : [];
                
                if (chatArray.length > 0) {
                  return chatArray.map((chat: any) => {
                    const chatId = chat.id;
                    const chatTitle = chat.title || 'Untitled Chat';
                    
                    return (
                      <div
                        key={chatId}
                        className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChatId === chatId
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedChatId(chatId)}
                      >
                        {isRenamingChat === chatId ? (
                          <input
                            type="text"
                            value={newChatTitle}
                            onChange={(e) => setNewChatTitle(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleRenameChat(chatId);
                            }}
                            onBlur={() => setIsRenamingChat(null)}
                            className="w-full bg-gray-600 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <>
                            <div className="text-white text-sm pr-16">{chatTitle}</div>
                            <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsRenamingChat(chatId);
                                  setNewChatTitle(chatTitle);
                                }}
                                className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                                title="Rename chat"
                              >
                                <svg className="h-4 w-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chatId);
                                }}
                                className="p-1.5 hover:bg-red-600 rounded transition-colors"
                                title="Delete chat"
                              >
                                <svg className="h-4 w-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="text-center text-gray-500 text-sm py-8 px-4">
                      <svg className="h-12 w-12 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No chats yet</p>
                      <p className="text-xs mt-1 text-gray-600">Start a conversation below!</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading messages...</p>
                  </div>
                </div>
              ) : chatContent ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  {(() => {
                    // Get messages from nested data structure
                    const messages = chatContent.data?.messages || chatContent.messages || [];
                    
                    if (Array.isArray(messages) && messages.length > 0) {
                      return messages.map((msg: any, index: number) => {
                        // Handle the actual API format
                        const messageContent = msg.message_content || msg.content || msg.text || '';
                        const messageSender = msg.sent_by === 'user' ? 'user' : 'bot';
                        const messageId = msg.id || index;
                        
                        return (
                          <div key={messageId} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              messageSender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                            }`}>
                              {messageSender === 'user' ? 'U' : 'AI'}
                            </div>
                            <div className="flex-1">
                              <div className="text-white whitespace-pre-wrap">{messageContent}</div>
                              <div className="flex items-center space-x-4 mt-2">
                                <button className="text-gray-400 hover:text-white transition-colors" title="Regenerate">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors" title="Like">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors" title="Dislike">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors" title="Copy">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    } else {
                      return (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <p>No messages in this chat yet. Start the conversation!</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Loading chat content...</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center max-w-2xl px-4">
              <svg className="h-20 w-20 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome to AI Healthcare Chat</h2>
              <p className="text-gray-500 mb-6">Start a conversation with our AI models</p>
              
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">How to get started:</h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
                    <span>Select an AI model from the sidebar (Chartwright, TranscriptX, Redactify, or Validify)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
                    <span>Type your message in the input box below</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
                    <span>Press Enter or click the send button to create a new chat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</span>
                    <span>Your conversations will appear in the sidebar for easy access</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Input Area - ALWAYS VISIBLE */}
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Attach file">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={selectedChatId ? "Type your message (Shift + Enter for new line)" : "Type a message to start a new chat..."}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none max-h-32"
                rows={1}
              />
              <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Voice input">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage || isCreatingChat || !message.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={selectedChatId ? "Send message" : "Create new chat"}
              >
                {isSendingMessage || isCreatingChat ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}