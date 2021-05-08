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

  const jobId = new URLSearchParams(window.location.search).get('job_id');
  const isSender = !jobId;

  let selectedFile = null;
  let fileSender = null;

  async function initSender(socket) {
    const bootstrapper = new SenderDataChannelBootstrapper(socket);
    console.log('[App] bootstrapping webrtc connection');
    const { connection, channel } = await bootstrapper.bootstrap();
    fileSender = new FileSender(connection, channel);
    // TODO: handle error
  }

  async function initReceiver(socket) {
    const bootstrapper = new ReceiverDataChannelBootstrapper(socket);
    console.log('[App] bootstrapping webrtc connection');
    const channel = await bootstrapper.bootstrap();
    // TODO: handle error
    const receiver = new FileReceiver(channel);
    //for await (const { meta, fileBuffer } of receiver.receiveFiles()) {
    //  downloadArrayBufferAsFile(fileBuffer, meta.fileName, meta.fileType);
    //}
  }

  async function sendFile() {
    // TODO: prevent sending empty files
    if (selectedFile.size <= 0) {
      throw new Error('不能传输空文件');
    }
    await fileSender.send(selectedFile);
    // TODO: handle error
  }

  function init() {
    let socket;
    if (isSender) {
      socket = io({ transports: ['websocket'], path: '/signal/sender', query: { jobId: '123456' } });
      socket.on('connect', () => initSender(socket));
    } else {
      socket = io({ transports: ['websocket'], path: '/signal/receiver', query: { jobId: '123456' } });
      socket.on('connect', () => initReceiver(socket));
    }
  }

  onMount(() => init());
</script>

<main>
  {#if jobId}
    <p>receive mode:</p>
    <p>ID: {jobId}</p>
  {:else}
    <p class="text-2xl opacity-80">send mode:</p>
    <input type="file" id="files" on:change="{(event) => (selectedFile = event.target.files[0])}" />
    <button disabled="{!selectedFile || !fileSender}" on:click="{sendFile}">Submit</button>
  {/if}
</main>
