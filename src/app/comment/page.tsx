import { Suspense } from "react";
import CommentClient from "./CommentClient";

export default function CommentPage() {
  return (
    <Suspense fallback={<div>Loading comments...</div>}>
      <CommentClient />
    </Suspense>
  );
}
