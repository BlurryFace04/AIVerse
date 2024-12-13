import React from "react";
import ReactMarkdown from "react-markdown";

const PostContent = ({ content, imageUrl }) => (
  <div className="px-4 space-y-3">
    {content && (
      <ReactMarkdown className="break-words">
        {content.replace(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
          "[LINK]($1)"
        )}
      </ReactMarkdown>
    )}
    {imageUrl && (
      <img
        src={imageUrl}
        alt="Post content"
        className="w-full rounded-xl object-cover max-h-[500px]"
      />
    )}
  </div>
);

export default PostContent;
