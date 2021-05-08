<style>
</style>

<script>
  import { io } from 'socket.io-client';
  import { onMount } from 'svelte';
  import { SenderDataChannelBootstrapper } from './lib/bootstrap/sender-data-channel-bootstrapper';
  import { ReceiverDataChannelBootstrapper } from './lib/bootstrap/receiver-data-channel-bootstrapper';
  import { FileSender } from './lib/file/file-sender';
  import { FileReceiver } from './lib/file/file-receiver';
  import { downloadArrayBufferAsFile } from './lib/utils';

  const id = new URLSearchParams(window.location.search).get('token');
  const isSender = !id;

  let selectedFile = null;
  let fileSender = null;

  async function initSender(socket) {
    const bootstrapper = new SenderDataChannelBootstrapper(socket, 'test');
    const { connection, channel } = await bootstrapper.bootstrap();
    fileSender = new FileSender(connection, channel);
    // TODO: handle error
  }

  async function initReceiver(socket) {
    const bootstrapper = new ReceiverDataChannelBootstrapper(socket, 'test');
    const channel = await bootstrapper.bootstrap();
    // TODO: handle error
    const receiver = new FileReceiver(channel);
    for await (const { meta, fileBuffer } of receiver.receiveFiles()) {
      downloadArrayBufferAsFile(fileBuffer, meta.fileName, meta.fileType);
    }
  }

  async function sendFile() {
    // TODO: prevent sending empty files
    await fileSender.send();
    // TODO: handle error
  }

  function init() {
    const signalSocket = io({ path: '/signal' });
    signalSocket.on('connect', () => {
      (isSender ? initSender(signalSocket) : initReceiver(signalSocket)).catch(console.error);
    });
  }

  onMount(() => init());
</script>

<main>
  {#if id}
    <p>receive mode:</p>
    <p>ID: {id}</p>
  {:else}
    <p>send mode:</p>
    <input type="file" id="files" on:change="{(event) => (selectedFile = event.target.files[0])}" />
    <button disabled="{!selectedFile || !fileSender}" on:click="{sendFile}">Submit</button>
  {/if}
</main>
