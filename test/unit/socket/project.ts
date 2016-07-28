import { expect } from 'chai'
import { apihost, ProjectAPI, Backend, SocketMock } from '../index'
import { flush, expectDeepEqual } from '../utils'
import { projects } from '../../mock/projects'

export default describe('project socket test', () => {

  let httpBackend: Backend
  let Socket: SocketMock
  let Project: ProjectAPI

  const project = projects[0]
  const projectId = project._id

  beforeEach(() => {
    flush()

    httpBackend = new Backend()
    Socket = new SocketMock()
    Project = new ProjectAPI()

    httpBackend.whenGET(`${apihost}projects/${projectId}`)
      .respond(JSON.stringify(project))
  })

  it('new project', done => {
    const organizationId = project._organizationId

    httpBackend.whenGET(`${apihost}organizations/${organizationId}/projects`)
      .respond([])

    Project.getOrgs(organizationId)
      .skip(1)
      .subscribe(projects => {
        expect(projects.length).to.equal(1)
        expectDeepEqual(projects[0], project)
        done()
      })

    Socket.emit('refresh', 'project', '', projectId)

    httpBackend.flush()
  })
})
