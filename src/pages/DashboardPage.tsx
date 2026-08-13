import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const connections = [
  { name: 'AWS Production', region: 'us-west-2', status: 'Healthy', cidr: '10.24.0.0/16' },
  { name: 'Azure Analytics', region: 'West US 2', status: 'Healthy', cidr: '10.31.0.0/16' },
  { name: 'GCP Sandbox', region: 'us-central1', status: 'Review', cidr: '10.42.0.0/16' }
]

export function DashboardPage() {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState<string | null>(null)
  const canEdit = user?.role === 'read-write'

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="kicker">Protected workspace</p>
          <h1>Network connections</h1>
          <p>Authentication and role checks are complete. This content is protected.</p>
        </div>
        <div className="user-menu">
          <div className="avatar" aria-hidden="true">{user?.name.charAt(0)}</div>
          <div>
            <strong>{user?.name}</strong>
            <span className={`role-badge ${canEdit ? 'role-write' : 'role-read'}`}>
              {canEdit ? 'Read / write' : 'Read only'}
            </span>
          </div>
          <button className="secondary-button" type="button" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="permission-banner">
        <div>
          <strong>{canEdit ? 'Editing enabled' : 'Viewing only'}</strong>
          <p>{canEdit ? 'Your role can view and modify network connections.' : 'Your role can view network connections, but edit controls are disabled.'}</p>
        </div>
        <span className="permission-chip">Role: {user?.role}</span>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><span>Total connections</span><strong>3</strong></article>
        <article className="stat-card"><span>Healthy</span><strong>2</strong></article>
        <article className="stat-card"><span>Needs review</span><strong>1</strong></article>
      </div>

      <div className="table-card">
        <div className="table-heading">
          <div>
            <h2>Cloud connections</h2>
            <p>Manage connectivity across cloud environments.</p>
          </div>
          <button className="primary-button" type="button" disabled={!canEdit} title={!canEdit ? 'Read-only users cannot create connections' : undefined}>
            + Add connection
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Region</th><th>CIDR</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {connections.map((connection) => (
                <tr key={connection.name}>
                  <td><strong>{connection.name}</strong></td>
                  <td>{connection.region}</td>
                  <td><code>{connection.cidr}</code></td>
                  <td><span className={`status-badge ${connection.status === 'Healthy' ? 'status-healthy' : 'status-review'}`}>{connection.status}</span></td>
                  <td className="action-cell">
                    {canEdit ? (
                      <button className="text-button" type="button" onClick={() => setEditing(connection.name)}>Edit</button>
                    ) : (
                      <button className="text-button disabled-action" type="button" disabled aria-label={`Edit ${connection.name} disabled for read-only role`}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditing(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title" onMouseDown={(event) => event.stopPropagation()}>
            <p className="kicker">Read / write action</p>
            <h2 id="edit-title">Edit {editing}</h2>
            <p>This lightweight dialog demonstrates that the edit action is reachable only for the read/write role.</p>
            <label htmlFor="display-name">Display name</label>
            <input id="display-name" defaultValue={editing} />
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary-button" type="button" onClick={() => setEditing(null)}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
