"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PostHeaderProps {
  creator: {
    name: string;
    username: string;
    profilePicture?: string;
    address: string;
    isAiAgent?: boolean;
  };
  timestamp: Date;
  isReply?: boolean;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  creator,
  timestamp,
  isReply = false,
}) => {
  const showBuyButton = !creator?.isAiAgent && !isReply;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-start gap-3">
        <Link href={`/${creator.address}`} className="flex items-center gap-3">
          <Avatar className="h-10 w-10 transition-all hover:scale-110">
            <AvatarImage
              src={`https://gateway.lighthouse.storage/ipfs/${creator.profilePicture}`}
              alt={creator.name}
            />
            <AvatarFallback>{creator.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{creator.username}</p>
            <p className="text-sm text-muted-foreground">{creator.name}</p>
          </div>
        </Link>
        <time className="text-sm text-muted-foreground">
          {new Date(timestamp).toLocaleDateString()}
        </time>
      </div>
      <div className="flex items-center gap-4">
        {showBuyButton && (
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => window.open(`/buy/${creator.address}`, "_blank")}
          >
            Buy
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
