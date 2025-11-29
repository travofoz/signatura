# Deployment Guide

This guide covers how to deploy Signatura to GitHub Pages for both automatic and manual deployments.

## Automatic Deployment

### Push to Master Branch
When you push to the `master` branch, the deployment workflow triggers automatically and deploys to GitHub Pages.

```bash
git push origin master
```

### Wildcard Branch Support
The workflow supports pushes to ANY branch (`branches: [ master, '**' ]`), so feature branches will also deploy automatically.

## Manual Deployment

### Using GitHub Web Interface
You can manually deploy any branch using GitHub's workflow interface:

1. Go to: https://github.com/travofoz/signatura/actions/workflows/deploy.yml
2. Click the **"Run workflow"** button
3. Enter the branch name (e.g., `fix/form-fields-critical`)
4. Click **"Run workflow"**

### Using GitHub CLI
```bash
# Deploy current branch
gh workflow run deploy.yml --field branch=fix/form-fields-critical

# Deploy specific branch
gh workflow run deploy.yml --field branch=your-branch-name

# Deploy with JSON input
gh workflow run deploy.yml --raw-field inputs='{"branch":"your-branch-name"}'
```

## GitHub Pages Configuration

### ⚠️ CRITICAL Configuration Requirements

**GitHub Pages MUST be configured to use "GitHub Actions" as the source, NOT "Deploy from a branch".**

#### Setup Steps:
1. Go to repository **Settings → Pages**
2. Under "Build and deployment" → "Source", select **"GitHub Actions"**
3. Save configuration

#### Why This Matters:
- **"Deploy from a branch"**: GitHub Pages processes source files with Jekyll (serves README.md)
- **"GitHub Actions"**: GitHub Pages serves artifacts uploaded by workflow (serves built app)

#### Required Files:
- `.nojekyll` - Disables Jekyll processing
- `CNAME` - Custom domain configuration (copied to build directory)
- `svelte.config.js` - Base path set to `''` for custom domains

## Workflow Process

1. **Build**: `npm run build` creates production build
2. **Upload**: Actions upload `./build` directory as artifact
3. **Deploy**: GitHub Pages serves the artifact content

## Troubleshooting

### Common Issues

#### Workflow Not Triggering
- **Check**: GitHub Pages source is set to "GitHub Actions"
- **Verify**: Workflow file exists in default branch
- **Confirm**: Push changes trigger workflow

#### Manual Deployment Fails
- **Error**: "Map keys must be unique" or "Property workflow_dispatch is not allowed"
- **Solution**: Workflow file syntax is correct, use GitHub web interface

#### Build Failures
- **Check**: `npm run build` completes successfully
- **Verify**: No TypeScript/Svelte errors
- **Dependencies**: `npm ci` installs all required packages

#### Deployment Failures
- **Check**: GitHub Pages configuration is correct
- **Verify**: Artifact upload succeeds
- **Confirm**: Deployment job completes

#### Permission Errors
- **Error**: "Missing permissions" or "Access denied"
- **Solution**: Check workflow permissions section includes required scopes

### Environment Variables

The workflow uses these environment variables:
- `NODE_VERSION`: Set to '22'
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Branch Strategy

The workflow uses a branch pattern that supports:
- `master` - Production deployments
- `**` - All feature branches (wildcard)
- Any branch name via manual `workflow_dispatch`

This enables both automatic production deployments and feature branch testing.

## Advanced Usage

### Custom Domain
If using a custom domain, ensure:
1. `CNAME` file contains your domain
2. DNS A record points to GitHub Pages servers
3. GitHub Pages settings show custom domain

### Multiple Environments
The workflow supports deployment to different environments:
- **github-pages** (default) - Production
- **staging** - Preview/staging environment

Modify the `environment.name` in workflow if needed.

## Security Considerations

- Workflow runs with least privilege necessary
- Secrets are never logged or exposed
- Build artifacts are temporary and cleaned up automatically
- All changes are tracked in commit history

## Performance Optimization

- Build typically completes in 2-3 minutes
- Deployment takes 1-2 minutes
- Total time from push to live: ~5 minutes

## Monitoring

Check workflow status at: https://github.com/travofoz/signatura/actions

View deployment logs in the Actions tab of the repository.

## Rollback

If a deployment fails, GitHub Pages automatically serves the last successful deployment. To rollback:

```bash
# Revert to previous commit
git revert HEAD~1

# Push to trigger redeployment
git push origin master
```