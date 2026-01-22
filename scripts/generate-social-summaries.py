#!/usr/bin/env python3
"""
Auto-Generate Social Media Summaries for Blog Posts
Uses Claude/GPT to create Twitter and LinkedIn snippets
"""

import json
import os
import sys
from pathlib import Path

# Add your API keys here or use environment variables
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI not installed. Install with: pip install openai")

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("Warning: Anthropic not installed. Install with: pip install anthropic")

def load_posts():
    """Load blog posts from posts.json"""
    base_path = Path(__file__).parent.parent
    posts_file = base_path / 'data' / 'posts.json'
    
    if not posts_file.exists():
        print(f"Error: {posts_file} not found")
        return []
    
    with open(posts_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_twitter_summary(title, description, tags):
    """Generate Twitter summary (280 chars max)"""
    prompt = f"""Create a compelling Twitter post (max 280 characters) for this blog article:

Title: {title}
Description: {description}
Tags: {', '.join(tags) if tags else 'N/A'}

Requirements:
- Hook readers immediately
- Include 1-2 relevant hashtags
- End with a call to action or question
- Stay under 280 characters
- Make it shareable and engaging

Twitter Post:"""
    
    return generate_with_ai(prompt, max_tokens=100)

def generate_linkedin_summary(title, description, tags):
    """Generate LinkedIn summary (300 chars for preview, can be longer)"""
    prompt = f"""Create a professional LinkedIn post for this blog article:

Title: {title}
Description: {description}
Tags: {', '.join(tags) if tags else 'N/A'}

Requirements:
- Professional but engaging tone
- First line should hook (appears in preview)
- Include key insights or takeaways
- End with a question or call to action
- 200-400 characters for preview, can include more context

LinkedIn Post:"""
    
    return generate_with_ai(prompt, max_tokens=200)

def generate_with_ai(prompt, max_tokens=150):
    """Generate text using available AI API"""
    # Try Claude first (better for this use case)
    if ANTHROPIC_AVAILABLE:
        try:
            client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=max_tokens,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            return response.content[0].text.strip()
        except Exception as e:
            print(f"Claude error: {e}")
    
    # Fallback to OpenAI
    if OPENAI_AVAILABLE:
        try:
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-4",
                max_tokens=max_tokens,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI error: {e}")
    
    # Fallback: simple template
    return f"New post: {prompt.split('Title:')[1].split('\\n')[0] if 'Title:' in prompt else 'Check it out!'}"

def save_summaries(post, twitter_summary, linkedin_summary):
    """Save summaries to file"""
    base_path = Path(__file__).parent.parent
    summaries_dir = base_path / 'social_summaries'
    summaries_dir.mkdir(exist_ok=True)
    
    # Get post filename
    post_url = post.get('url', '')
    post_slug = post_url.split('/')[-1].replace('.html', '') if post_url else 'unknown'
    
    summary_file = summaries_dir / f"{post_slug}_summaries.json"
    
    summary_data = {
        'post_title': post.get('title', ''),
        'post_url': post_url,
        'twitter': twitter_summary,
        'linkedin': linkedin_summary,
        'generated_date': str(Path(__file__).stat().st_mtime)
    }
    
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved summaries for: {post.get('title', 'Unknown')}")

def main():
    """Main function"""
    print("🚀 Generating social media summaries for blog posts...\n")
    
    # Check API keys
    if not os.getenv('ANTHROPIC_API_KEY') and not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: No API keys found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable.")
        print("   Using fallback template generation.\n")
    
    posts = load_posts()
    
    if not posts:
        print("No posts found. Exiting.")
        return
    
    print(f"Found {len(posts)} posts. Generating summaries...\n")
    
    # Process each post
    for i, post in enumerate(posts, 1):
        title = post.get('title', 'Untitled')
        description = post.get('description', '')
        tags = post.get('tags', [])
        
        print(f"[{i}/{len(posts)}] Processing: {title}")
        
        try:
            twitter_summary = generate_twitter_summary(title, description, tags)
            linkedin_summary = generate_linkedin_summary(title, description, tags)
            
            save_summaries(post, twitter_summary, linkedin_summary)
            
            print(f"   Twitter: {twitter_summary[:60]}...")
            print(f"   LinkedIn: {linkedin_summary[:60]}...\n")
            
        except Exception as e:
            print(f"   ❌ Error: {e}\n")
            continue
    
    print("✅ Done! Summaries saved to social_summaries/")

if __name__ == '__main__':
    main()
