import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> | { platform: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  const { platform } = resolvedParams;
  
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const text = searchParams.get('text') || 'Check out this paste';
  const title = searchParams.get('title') || 'Check out this paste';

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedTitle = encodeURIComponent(title);

  let shareUrl = '';

  switch (platform.toLowerCase()) {
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      break;
    case 'twitter':
    case 'x':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    case 'reddit':
      shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
      break;
    case 'email':
      shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
      break;
    case 'sms':
      shareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
      break;
    default:
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
  }

  // Redirect to the share URL
  return NextResponse.redirect(shareUrl);
}


