from django.core.management.base import BaseCommand
import uuid
import random
from quiblet.models import Quiblet, Quib, Comment, CommentVote, QuibVote


class Command(BaseCommand):
    help = "Seeds the database with realistic quiblets, quibs, and comments."

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Create simulated users (UUIDs)
        user_ids = [uuid.uuid4() for _ in range(5)]
        self.stdout.write(f"Created {len(user_ids)} simulated user IDs.")

        # 2. Create Quiblets
        quiblets_data = [
            {
                "name": "programming",
                "description": "Everything about code, frameworks, and architecture.",
                "title": "Programming & CS",
            },
            {
                "name": "gaming",
                "description": "Discuss your favorite games, consoles, and indie gems.",
                "title": "The Gaming Hub",
            },
            {
                "name": "philosophy",
                "description": "Deep thoughts, ethics, and existential questions.",
                "title": "Philosophy Corner",
            },
        ]

        quiblets = []
        for data in quiblets_data:
            quiblet, created = Quiblet.objects.get_or_create(
                name=data["name"],
                defaults={
                    "description": data["description"],
                    "title": data["title"],
                    "nsfw": False,
                },
            )
            quiblets.append(quiblet)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created quiblet: q/{quiblet.name}")
                )
                # Add a moderator and some members
                mod_id = random.choice(user_ids)
                quiblet.members.create(member_id=mod_id, is_moderator=True)
                for user_id in user_ids:
                    if user_id != mod_id and random.random() > 0.3:
                        quiblet.members.create(member_id=user_id)
            else:
                self.stdout.write(f"Quiblet q/{quiblet.name} already exists.")

        # 3. Create Quibs (10 quibs)
        quibs_data = [
            # Programming
            {
                "quiblet": quiblets[0],
                "title": "Why Rust is the future of systems programming",
                "content": """
# The Case for Rust

Rust has been the "most loved" language for years, and for good reason. It solves the age-old problem of **memory safety** without the overhead of a garbage collector.

### Key Benefits:
- **Fearless Concurrency**: No more data races.
- **Zero-cost Abstractions**: High-level feel, low-level performance.
- **Great Package Manager**: `cargo` is miles ahead of many others.

```rust
fn main() {
    println!("Hello, Web3 and Systems world!");
}
```

Is it time to start rewriting our C++ legacy codebases? Let's discuss.
""",
            },
            {
                "quiblet": quiblets[0],
                "title": "Must-have VS Code extensions for 2024",
                "content": """
If you aren't using these extensions, are you even coding? 😅

1. **Error Lens**: Highlights errors inline so you don't have to hover.
2. **Peacock**: Color-code your workspace to differentiate between windows.
3. **GitLens**: Supercharge your Git workflow.
4. **Prettier/ESLint**: Standardize your formatting.

*Pro tip: Use a custom font like Fira Code for those sweet ligatures!*
""",
            },
            {
                "quiblet": quiblets[0],
                "title": "Async/Await: It's not as scary as it looks",
                "content": """
Async programming is often seen as a dark art, but once you understand the **Event Loop**, everything clicks.

> "The event loop is like a waiter. It takes your order, tells the kitchen, and moves to the next table instead of waiting by the stove."

In Python, it looks like this:
```python
import asyncio

async def main():
    print("Working...")
    await asyncio.sleep(1)
    print("Done!")

asyncio.run(main())
```
""",
            },
            {
                "quiblet": quiblets[0],
                "title": "The rise of HTMX: Are SPAs dying?",
                "content": """
HTMX is taking the world by storm. It allows you to access AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes.

**Why it matters:**
- **Less Javascript**: You don't always need 2MB of React to toggle a dropdown.
- **Locality of Behavior**: Keep your logic where your HTML is.

Is the industry swinging back to server-side rendering?
""",
            },
            # Gaming
            {
                "quiblet": quiblets[1],
                "title": "Elden Ring: Shadow of the Erdtree impressions",
                "content": """
# Return to the Lands Between

I've spent 20 hours in the DLC and I'm still blown away. FromSoftware has done it again. The verticality of the map is **insane**.

### The Good:
- New weapon types are incredible (Backhand blades!)
- The atmosphere is peak FromSoft.
- Bosses are challenging but fair (mostly).

### The Bad:
- The performance on some consoles is still a bit jittery.

*Has anyone found the secret path to the Abyssal Woods?*
""",
            },
            {
                "quiblet": quiblets[1],
                "title": "Indie games are carrying the industry right now",
                "content": """
While AAA studios are playing it safe with sequels and microtransactions, indie devs are innovating.

- **Balatro**: Who knew a poker roguelike could be this addictive?
- **Animal Well**: A masterclass in atmosphere and discovery.
- **Hades II**: Improving on perfection.

Support your local indie dev! 🕹️
""",
            },
            {
                "quiblet": quiblets[1],
                "title": "Is cloud gaming finally viable?",
                "content": """
I tried **GeForce Now** on a 100Mbps fiber connection and... I couldn't tell the difference from local hardware. 

Points to consider:
*   [ ] Latency (the biggest hurdle)
*   [ ] Ownership (if the service dies, do you lose the game?)
*   [ ] Subscription fatigue

Are you ready to sell your GPU?
""",
            },
            # Philosophy
            {
                "quiblet": quiblets[2],
                "title": "The Trolley Problem in the age of Autonomous Vehicles",
                "content": """
The classic ethical dilemma is no longer just for textbooks. As we program self-driving cars, we are essentially codifying morality.

1. Should the car protect the driver at all costs?
2. Should it minimize the total number of casualties?
3. What if the choice is between a dog and a person?

**We are the architects of silicon ethics.**
""",
            },
            {
                "quiblet": quiblets[2],
                "title": "Stoicism for the Modern Developer",
                "content": """
> "You have power over your mind — not outside events. Realize this, and you will find strength." — Marcus Aurelius

Applied to coding:
- **Externals**: Stakeholder changes, legacy bugs, server outages.
- **Internals**: Your reaction, your code quality, your focus.

Next time a production server goes down, try a stoic breath.
""",
            },
            {
                "quiblet": quiblets[2],
                "title": "What is Quibble? A philosophical take",
                "content": """
Is Quibble just another social platform? Or is it a digital manifestation of the *Aura*?

In a world of short-form content and vanishing thoughts, we need a place for **deep quibs**. A place where the conversation survives the scroll.

What does it mean to be a member of a digital community?
""",
            },
        ]

        created_quibs = []
        for i, data in enumerate(quibs_data):
            poster_id = random.choice(user_ids)
            quib = Quib.objects.create(
                quiblet=data["quiblet"],
                poster_id=poster_id,
                title=data["title"],
                content=data["content"],
                status=Quib.Status.APPROVED,
                is_published=True,
            )
            created_quibs.append(quib)
            self.stdout.write(f"Created quib: {quib.title} ({quib.id})")

        # 4. Create Comments
        comments_pool = [
            "Great post! I totally agree with this.",
            "I have to disagree here. Have you considered the alternatives?",
            "Interesting perspective. Thanks for sharing!",
            "Can you provide more details on this part?",
            "This really helped me understand the topic better.",
            "I'm not sure about this one, seems a bit controversial.",
            "Exactly what I was looking for!",
            "Nice one! Looking forward to more posts like this.",
        ]

        for quib in created_quibs:
            num_comments = random.randint(2, 5)
            for _ in range(num_comments):
                commenter_id = random.choice(user_ids)
                # Use create_child as seen in the views
                comment = Comment.objects.create_child(
                    parent=None,
                    quib=quib,
                    commenter_id=commenter_id,
                    content=random.choice(comments_pool),
                )

                # Add a vote for the comment
                CommentVote.objects.create(
                    comment=comment, voter_id=commenter_id, value=1
                )

                # Add a reply to some comments (nested)
                if random.random() > 0.5:
                    reply_id = random.choice(user_ids)
                    reply = Comment.objects.create_child(
                        parent=comment,
                        quib=quib,
                        commenter_id=reply_id,
                        content=f"Replying to {commenter_id}: "
                        + random.choice(comments_pool),
                    )
                    CommentVote.objects.create(
                        comment=reply, voter_id=reply_id, value=1
                    )

            # Add some votes for the quib itself
            for voter_id in user_ids:
                if random.random() > 0.3:
                    QuibVote.objects.create(
                        quib=quib,
                        voter_id=voter_id,
                        value=random.choice([1, 1, 1, -1]),  # Weight towards upvotes
                    )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
