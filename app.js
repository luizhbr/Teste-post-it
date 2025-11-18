const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const colorSelect = document.getElementById('color');
const saveButton = document.getElementById('save');
const clearButton = document.getElementById('clear');
const notesContainer = document.getElementById('notes');
const emptyMessage = document.getElementById('empty-message');
const template = document.getElementById('note-template');

const STORAGE_KEY = 'postit-notes';

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Erro ao carregar notas', err);
    return [];
  }
}

function persistNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function randomTilt() {
  return (Math.random() * 2 - 1).toFixed(2);
}

function renderNotes() {
  const notes = loadNotes();
  notesContainer.innerHTML = '';
  emptyMessage.style.display = notes.length ? 'none' : 'block';

  notes.forEach((note) => {
    const clone = template.content.cloneNode(true);
    const noteEl = clone.querySelector('.note');
    const titleEl = clone.querySelector('.note-title');
    const contentEl = clone.querySelector('.note-content');
    const footerEl = clone.querySelector('.note-footer');
    const deleteBtn = clone.querySelector('.delete');

    titleEl.textContent = note.title || 'Sem título';
    contentEl.textContent = note.content;
    footerEl.textContent = formatDate(note.createdAt);
    noteEl.style.setProperty('--tilt', randomTilt());
    noteEl.style.background = note.color;

    deleteBtn.addEventListener('click', () => removeNote(note.id));
    notesContainer.appendChild(clone);
  });
}

function clearForm() {
  titleInput.value = '';
  contentInput.value = '';
  titleInput.focus();
}

function saveNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const color = colorSelect.value;

  if (!content) {
    contentInput.focus();
    return;
  }

  const notes = loadNotes();
  const newNote = {
    id: crypto.randomUUID(),
    title,
    content,
    color,
    createdAt: new Date().toISOString(),
  };

  persistNotes([newNote, ...notes]);
  clearForm();
  renderNotes();
}

function removeNote(id) {
  const filtered = loadNotes().filter((note) => note.id !== id);
  persistNotes(filtered);
  renderNotes();
}

saveButton.addEventListener('click', saveNote);
clearButton.addEventListener('click', clearForm);

contentInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    saveNote();
  }
});

renderNotes();
