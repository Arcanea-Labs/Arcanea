import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendMessage } from '../src'
import { config } from '../src/config'
import fetch from 'node-fetch'

vi.mock('node-fetch', () => ({ default: vi.fn() }))

const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock.mockReset()
})

describe('sendMessage', () => {
  it('throws when API key is missing', async () => {
    const originalKey = config.claudeApiKey
    config.claudeApiKey = ''
    await expect(sendMessage({ prompt: 'hi' })).rejects.toThrow()
    config.claudeApiKey = originalKey
  })

  it('throws on non-200 responses', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })
    await expect(sendMessage({ prompt: 'hi' })).rejects.toThrow('HTTP 500')
  })
})

