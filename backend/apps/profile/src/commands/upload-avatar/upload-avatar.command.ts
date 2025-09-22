export class UploadAvatarCommand {
  constructor(
    public readonly userId: number,
    public readonly avatarPayload: any,
  ) {}
}
