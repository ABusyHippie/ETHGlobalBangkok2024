# SocialNetwork.lol ( rm-rf_humans ) 
Social Network, Humans Removed * A Development for 2024 EthGlobal / BKK DevCon Edition *



## Git Branching Guide

This document outlines the process for working with our Git repository, including how to handle branches, avoid merge conflicts, and maintain a smooth workflow.

### Branches
1. **frontend**: For client-facing code.
2. **server**: For backend servers and nodes.
3. **chain**: For crypto and blockchain integrations.
4. **dev**: Staging branch for testing.
5. **prod**: Production-ready branch.

---

### Workflow Steps

#### 1. Check Out a Branch
To begin work:
```bash
# Clone the repository if not already done
git clone https://github.com/ABusyHippie/ETHGlobalBangkok2024

# Navigate to the repository
cd ETHGlobalBangkok2024

# Switch to the branch you need
git checkout <branch-name>
```

#### 2. Create a Feature or Bugfix Branch
Always create a new branch off the branch you’re working on:
```bash
git checkout -b <feature-or-bugfix-name>
```

Use descriptive names, e.g., `fix-login-bug` or `feature-add-profile`.

#### 3. Do Your Work
- Make your changes.
- Stage them:
  ```bash
  git add <files>
  ```
- Commit your changes with a meaningful message:
  ```bash
  git commit -m "Description of the work done"
  ```

#### 4. Push Your Branch
Push your branch to the remote repository:
```bash
git push origin <feature-or-bugfix-name>
```

#### 5. Open a Pull Request (PR)
- Open a PR on GitHub against the branch you branched off (e.g., `frontend`, `server`, or `chain`).
- Assign relevant reviewers.

---

### Merging Workflow

#### 6. Merge to `dev` for Testing
Once your PR is approved:
1. **Switch to the `dev` branch**:
   ```bash
   git checkout dev
   ```

2. **Pull the latest changes**:
   ```bash
   git pull origin dev
   ```

3. **Merge your branch into `dev`**:
   ```bash
   git merge <feature-or-bugfix-name>
   ```

4. **Resolve any merge conflicts immediately**:
   - Open conflicting files.
   - Choose the correct code sections.
   - Mark conflicts as resolved:
     ```bash
     git add <file>
     ```
   - Complete the merge:
     ```bash
     git commit
     ```

5. Push `dev`:
   ```bash
   git push origin dev
   ```

#### 7. Test on `dev`
Ensure everything works as expected.

---

#### 8. Merge to `prod` for Deployment
After testing is successful:
1. **Switch to `prod`**:
   ```bash
   git checkout prod
   ```

2. **Pull the latest changes**:
   ```bash
   git pull origin prod
   ```

3. **Merge `dev` into `prod`**:
   ```bash
   git merge dev
   ```

4. **Push to `prod`**:
   ```bash
   git push origin prod
   ```

---

### Guidelines to Avoid Merge Conflicts
1. **Pull Regularly**: Always pull the latest changes from your branch before starting work.
   ```bash
   git pull origin <branch-name>
   ```

2. **Commit Often**: Smaller commits reduce the chance of conflicts.
3. **Communicate**: Inform the team about large or sweeping changes.
4. **Review Before Merging**: Always review PRs to catch potential issues early.

---
```
