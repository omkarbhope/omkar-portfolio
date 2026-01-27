# Check Embeddings in MongoDB

## Option 1: MongoDB Compass / MongoDB Shell

### Check all embeddings summary:
```javascript
db.embeddings.aggregate([
  {
    $group: {
      _id: "$contentType",
      count: { $sum: 1 }
    }
  }
])
```

### Check total count:
```javascript
db.embeddings.countDocuments()
```

### Check embeddings for a specific project:
```javascript
// Replace PROJECT_ID with your actual project ID
db.embeddings.find(
  { 
    contentType: "project", 
    referenceId: "6976b165f61af48bb95b0cf0" 
  },
  { 
    content: 1, 
    metadata: 1, 
    createdAt: 1, 
    _id: 0 
  }
)
```

### Count embeddings for a specific project:
```javascript
db.embeddings.countDocuments({
  contentType: "project",
  referenceId: "6976b165f61af48bb95b0cf0"
})
```

### Check embeddings for other content types:
```javascript
// Experience
db.embeddings.find({ contentType: "experience", referenceId: "EXPERIENCE_ID" })

// Skill
db.embeddings.find({ contentType: "skill", referenceId: "SKILL_ID" })

// Education
db.embeddings.find({ contentType: "education", referenceId: "EDUCATION_ID" })
```

## Option 2: Browser Console (while logged into admin)

Open browser console on any admin page and run:

```javascript
// Get summary
fetch('/api/admin/embeddings/check')
  .then(r => r.json())
  .then(console.log);

// Check specific project
fetch('/api/admin/embeddings/check?contentType=project&referenceId=6976b165f61af48bb95b0cf0')
  .then(r => r.json())
  .then(console.log);
```
