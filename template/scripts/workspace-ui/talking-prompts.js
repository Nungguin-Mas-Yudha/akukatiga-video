// The prompt starts the video; the talking-head skill decides every stage and every stop.
export function talkingVideoInstructions() {
  return 'Keep my footage untouched. Edit this video with the talking-head skill: read it and the pattern for each stage and follow them, including what it says to show me before going on. Create the video in workspace/projects/<date>-talking-head-<slug> with its project.json so my workspace can follow it, and copy the delivered file to workspace/output/<that folder name>/.';
}

export function talkingResumePrompt(project) {
  return `/talking-head\nContinue ${JSON.stringify(project.path)} with the talking-head skill, from the stage its files show. Keep approved layers locked, and show me what the skill says to show me.`;
}
