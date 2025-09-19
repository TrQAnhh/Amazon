export class UploadAvatarEvent {
  constructor(
    public readonly userId: number,
    public readonly avatarPayload: any,
  ) {}
}
