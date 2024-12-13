import lighthouse from '@lighthouse-web3/sdk'

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get('file');
  const fileType = data.get('fileType');

  if (!file) {
    return new Response(JSON.stringify({ error: 'File is required' }), {
      status: 400,
    });
  }

  // if (fileType !== 'image') {
  //   return new Response(
  //     JSON.stringify({ error: 'Only image files are allowed' }),
  //     { status: 400 }
  //   );
  // }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const formData = new FormData();
    formData.append('file', new Blob([buffer]), file.name)

    // const response = await lighthouse.uploadBuffer(
    //   buffer, 
    //   process.env.LIGHTHOUSE_API_KEY
    // );

    // console.log('Lighthouse result:', response);

    const response = await fetch('https://aiverse-fast-435887166123.asia-south1.run.app/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log('Response:', response);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // if (response.data) {
    //   return new Response(
    //     JSON.stringify({ success: true, ipfsHash: response.data.Hash }),
    //     { status: 200 }
    //   );
    // } else {
    //   throw new Error('Failed to upload to Lighthouse');
    // }

    const payload = {
      success: true,
      url: result.url,
      filename: result.filename,
      contentType: result.content_type
    }

    console.log('Payload:', payload);

    return new Response(JSON.stringify(payload), { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return new Response('Failed to upload to GCP', { status: 500 });
  }
}
