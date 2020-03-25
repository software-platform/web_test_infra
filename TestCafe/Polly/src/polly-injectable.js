import FetchAdapter from '@pollyjs/adapter-fetch'
import XHRAdapter from '@pollyjs/adapter-xhr'
import { Polly } from '@pollyjs/core'
import RESTPersister from '@pollyjs/persister-rest'

Polly.register(FetchAdapter)
Polly.register(XHRAdapter)
Polly.register(RESTPersister)

window.Polly = Polly
