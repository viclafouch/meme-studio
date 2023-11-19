import { useMutation, UseMutationOptions } from '@tanstack/react-query'

const PERMISSIONS: PermissionDescriptor[] = [
  { name: 'clipboard-read' as PermissionName },
  { name: 'clipboard-write' as PermissionName }
]

const askPermission = async (queryName: PermissionDescriptor) => {
  try {
    const permissionStatus = await navigator.permissions.query(queryName)

    if (permissionStatus.state !== 'granted') {
      return await Promise.reject(permissionStatus)
    }

    return true
  } catch (error) {
    // Browser compatibility / Security error (ONLY HTTPS) ...
    return Promise.reject(error)
  }
}

export function useClipboard(
  options?:
    | Omit<
        UseMutationOptions<void, unknown, { blob: Blob }, unknown>,
        'mutationFn'
      >
    | undefined
) {
  const { mutate } = useMutation({
    mutationFn: async ({ blob }: { blob: Blob }) => {
      await Promise.all(PERMISSIONS.map(askPermission))

      const clipboardItem = [new ClipboardItem({ [blob.type]: blob })]
      await navigator.clipboard.write(clipboardItem)
    },
    ...options
  })

  return {
    copy: mutate
  }
}
