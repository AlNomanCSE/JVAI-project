import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://lbserver.clintechso.com/api/';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${API_BASE_URL}${path}/`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = request.headers.get('authorization');
  console.log('GET Request - Auth Header:', authHeader ? 'Present' : 'Missing');
  console.log('GET Request - URL:', url);
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('GET Response - Status:', response.status);
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${API_BASE_URL}${path}/`;
  
  // Try to parse body, if empty or invalid, use empty object
  let body = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (error) {
    console.log('POST Request - No body or invalid JSON, using empty object');
  }

  console.log('POST Request - URL:', url);
  console.log('POST Request - Body:', body);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log('POST Response - Status:', response.status);
    
    // Try to parse response, some endpoints return empty body
    let data = {};
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (e) {
      console.log('POST Response - No body or invalid JSON');
    }
    
    console.log('POST Response - Data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to post data' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${API_BASE_URL}${path}/`;
  const body = await request.json();

  console.log('PATCH Request - URL:', url);
  console.log('PATCH Request - Body:', body);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = request.headers.get('authorization');
  console.log('PATCH Request - Auth Header:', authHeader ? `Present: ${authHeader.substring(0, 30)}...` : 'Missing');
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    console.log('PATCH Response - Status:', response.status);
    const data = await response.json();
    console.log('PATCH Response - Data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${API_BASE_URL}${path}/`;

  console.log('DELETE Request - URL:', url);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authHeader = request.headers.get('authorization');
  console.log('DELETE Request - Auth Header:', authHeader ? 'Present' : 'Missing');
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    console.log('DELETE Response - Status:', response.status);
    
    // Try to parse response, some endpoints return empty body
    let data = {};
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (e) {
      console.log('DELETE Response - No body or invalid JSON');
    }
    
    console.log('DELETE Response - Data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}