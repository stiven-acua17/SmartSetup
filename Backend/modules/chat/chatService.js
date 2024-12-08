/**
 * @file chatService.js
 * @description Servicio para manejar operaciones CRUD de chats en Firebase Realtime Database.
 * @requires ../../config/firebaseConfig Configuración de Firebase. 
 */

const { db } = require('../../config/firebaseConfig')

/**
 * Crea un nuevo chat en la base de datos.
 * @function createChat
 * @param {string} chatName - Nombre del chat a crear.
 * @returns {Promise<string>} Mensaje de éxito al crear el chat.
  */
const createChat = async (chatName) => {
  console.log("CREATE CHAT")
  try {
    const chatRef = db.ref('chats');

    const newChatRef = chatRef.push();
    await newChatRef.set({
      name: chatName,
      createdAt: new Date().toISOString(),
      messages: [],
    });

    console.log(`Chat '${chatName}' creado exitosamente`);
    return `Chat '${chatName}' creado exitosamente`;
  } catch (error) {
    console.error("Error en la función createChat:", error);
    throw error;
  }
}


/**
 * Obtiene la información de un chat por su nombre.
 * @function getChat
 * @param {string} chatName - Nombre del chat a buscar.
 * @returns {Promise<Object>} Objeto con los datos del chat (id, name, createdAt, messages).
 */
const getChat = async (chatName) => {
  console.log('GET CHAT');
  if (!chatName) {
    throw new Error('El nombre del chat es obligatorio.');
  }

  try {
    const chatRef = db.ref('chats');
    const snapshot = await chatRef.orderByChild('name').equalTo(chatName).once('value');
    
    if (!snapshot.exists()) {
      throw new Error('El chat no existe');
    }

    const chatKey = Object.keys(snapshot.val())[0];
    const chatData = snapshot.val()[chatKey];

    return {
      id: chatKey,
      name: chatData.name,
      createdAt: chatData.createdAt,
      messages: chatData.messages || [],
    };
  } catch (error) {
    console.error("Error en la función getChat:", error);
    throw error;
  }
}


/**
 * Agrega un mensaje a un chat existente.
 * @function updateChat
 * @param {string} chatName - Nombre del chat a actualizar.
 * @param {string|Object} message - Mensaje a agregar al chat (puede ser texto o un objeto más complejo).
 * @returns {Promise<string>} Mensaje de éxito al agregar el mensaje.
 */
const updateChat = async (chatName, message) => {
  try {
    const chatRef = db.ref('chats');
    const snapshot = await chatRef.orderByChild('name').equalTo(chatName).once('value');

    if (!snapshot.exists()) {
      throw new Error('El chat no existe.');
    }

    const chatKey = Object.keys(snapshot.val())[0]; 
    const listMessageRef = chatRef.child(chatKey).child('messages'); 
    await listMessageRef.push(message);

    return { success: true, message: "Mensaje agregado al chat exitosamente." };
  } catch (error) {
    console.error('Error al agregar el mensaje al chat:', error.message);
    return { success: false, message: "Hubo un error al agregar el mensaje al chat." };
  }
};

/**
 * Elimina un chat existente por su nombre.
 * @function deleteChat
 * @param {string} chatName - Nombre del chat a eliminar.
 * @returns {Promise<string>} Mensaje de éxito al eliminar el chat.
 */
const deleteChat = async (chatName) => {
  console.log("DELETE CHAT");
  if (!chatName) {
    throw new Error('El nombre del chat es obligatorio.');
  }

  try {
    const chatRef = db.ref('chats');
    const snapshot = await chatRef.orderByChild('name').equalTo(chatName).once('value');

    if (!snapshot.exists()) {
      throw new Error('El chat no existe.');
    }

    const chatKey = Object.keys(snapshot.val())[0]; // Obtiene la clave del chat
    await chatRef.child(chatKey).remove(); // Elimina el chat usando la clave.

    console.log(`Chat '${chatName}' eliminado exitosamente`);
    return `Chat '${chatName}' eliminado exitosamente.`;
  } catch (error) {
    console.error("Error en la función deleteChat:", error.message);
    throw error;
  }
};


module.exports = { createChat, getChat, updateChat, deleteChat }