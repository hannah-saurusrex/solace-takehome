# 📝 Project Discussion

## ✅ What Got Done

Here’s a breakdown of what I built out:

- **Seeded the database**  
  I created realistic advocate data and used an API route to wipe and reseed the DB. Each advocate has a max of 2 specialties to keep things clean and balanced.

- **Pulled out components**  
  Broke out the search bar and table into their own components — easier to manage and reuse.

- **API-first approach**  
  All data fetching happens through `/api/advocates` — no server actions here. Keeps frontend/backend roles separate, just like the instructions asked.

- **Pagination**  
  Added backend support for pagination with `limit` and `offset`, and hooked it up to simple frontend controls so you can page through results.

- **Search across fields**  
  Users can search by name, city, degree, phone, specialties — all debounced for smoother UX.

- **Sortable table**  
  Used TanStack Table to make columns sortable (on desktop) and made sure the mobile layout still looks and works great.

- **Accessibility improvements**  
  Added ARIA labels and semantic roles so screen readers can navigate the table and mobile view more easily.

---

## ✨ Bonus Features (Optional PRs)

These weren’t required, but I wanted to go a little further:

- **Specialty filter dropdown ([PR #3])**  
  Added a dropdown filter for advocate specialties — you can select one or multiple to narrow results. It works alongside the search bar and is built as its own component.

- **Expandable rows ([PR #4])**  
  Click a row and it expands to show 3 placeholder cards ("More information here"). It's a scaffold to show how this could grow into something like availability, reviews, or contact options.

---

## 💡 Ideas for the Future

If this were a bigger project or part of a larger codebase, I’d love to:

- Move all filtering/sorting to the backend for scalability
- Improve mobile UI with a card grid layout
- Add automated a11y checks (Lighthouse, Axe)
- Load extra info into expanded rows (e.g. reviews, availability)
- Let users save their filters or preferences
- Add tests for API logic and UI behavior

---

Thanks for the fun project! Let me know if you’d like a linkable version or anything cleaned up further.
