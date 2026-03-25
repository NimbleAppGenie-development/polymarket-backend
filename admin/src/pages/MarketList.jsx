import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Switch,
    Chip
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import Loader from "../components/Loader";

export default function MarketList() {

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("UserToken");

    const [markets, setMarkets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [activeAccordion, setActiveAccordion] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [categoryInput, setCategoryInput] = useState("");

    const [newMarket, setNewMarket] = useState({
        title: "",
        description: "",
        category: [],
        homeTabView: false
    });

    const [editMarket, setEditMarket] = useState(null);
    const [editCategoryInput, setEditCategoryInput] = useState("");

    // ================= FETCH =================

    const fetchMarkets = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${apiBaseUrl}/api/admin/markets`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );


            const data = res.data.message;
            console.log("MARKETS API:", data);

            setMarkets(Array.isArray(data) ? data : []);

        } catch (err) {
            toast.error("Failed to load markets");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                `${apiBaseUrl}/api/admin/markets/categories`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("CATEGORIES API:", res.data);

            const data = res.data.message;
            setCategories(Array.isArray(data) ? data : []);

        } catch {
            toast.error("Failed to load categories");
            setCategories([]);
        }
    };
    useEffect(() => {
        fetchMarkets();
        fetchCategories();
    }, []);

    // ================= UI =================

    const toggleAccordion = (id) => {
        setActiveAccordion(prev => (prev === id ? null : id));
    };

    // ================= CATEGORY =================

    const addCategory = (value, isEdit = false) => {
        if (!value) return;

        const trimmed = value.trim().toLowerCase();

        if (!trimmed) return;

        if (isEdit) {
            setEditMarket(prev => {
                const existing = prev.category || [];

                if (existing.includes(trimmed)) return prev;

                return {
                    ...prev,
                    category: [...existing, trimmed]
                };
            });

            setEditCategoryInput("");
        } else {
            if (newMarket.category.includes(trimmed)) return;

            setNewMarket({
                ...newMarket,
                category: [...newMarket.category, trimmed]
            });
            setCategoryInput("");
        }
    };

    const removeCategory = (value, isEdit = false) => {
        if (isEdit) {
            setEditMarket(prev => ({
                ...prev,
                category: prev.category.filter(c => c !== value)
            }));
        } else {
            setNewMarket({
                ...newMarket,
                category: newMarket.category.filter(c => c !== value)
            });
        }
    };

    // ================= CREATE =================

    const addMarket = async () => {
        try {
            setLoading(true);

            if (!newMarket.title.trim()) {
                toast.error("Title required");
                return;
            }

            const exists = markets.some(
                m => m.title.toLowerCase() === newMarket.title.toLowerCase()
            );

            if (exists) {
                toast.error("Market with this title already exists");
                return;
            }

            let payload = {
                ...newMarket,
                category: []
            };
            payload.category.push(categoryInput)

            const res = await axios.post(
                `${apiBaseUrl}/api/admin/markets`, payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                toast.success("Market created");
                setOpenAdd(false);
                setNewMarket({ title: "", description: "", category: [], homeTabView: false });
                fetchMarkets();
                fetchCategories();
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    // ================= UPDATE =================

    const updateMarket = async () => {
        try {
            setLoading(true);

            const payload = {
                ...editMarket,
                category: editMarket.category || []
            };

            console.log("payload", payload)

            const res = await axios.put(
                `${apiBaseUrl}/api/admin/markets/${editMarket.id}`, payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                toast.success("Market updated");
                setEditMarket(null);
                fetchMarkets();
                fetchCategories();
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE =================

    const deleteMarket = async (id) => {
        try {
            setLoading(true);

            await axios.delete(
                `${apiBaseUrl}/api/admin/markets/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Deleted");
            fetchMarkets();

        } catch {
            toast.error("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= STATUS =================

    const toggleStatus = async (market) => {
        try {
            setLoading(true);

            const newStatus = market.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

            await axios.patch(
                `${apiBaseUrl}/api/admin/markets/${market.id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchMarkets();

        } catch {
            toast.error("Status update failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= HOME TAB =================

    const toggleHomeTab = async (market) => {
        try {
            setLoading(true);

            await axios.put(
                `${apiBaseUrl}/api/admin/markets/${market.id}`,
                {
                    homeTabView: !market.homeTabView
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchMarkets();

        } catch {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loader open={loading} />

            <div style={{ padding: 24 }}>

                <Typography variant="h4">Markets</Typography>

                <Button
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={() => setOpenAdd(true)}
                >
                    Add Market
                </Button>

                {markets.map((m) => (

                    <Accordion
                        key={m.id}
                        expanded={activeAccordion === m.id}
                        onChange={() => toggleAccordion(m.id)}
                    >

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>

                            <Typography sx={{ fontWeight: 600 }}>
                                {m.title}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                Status
                                <Switch
                                    checked={m.status === "ACTIVE"}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleStatus(m)}
                                />

                                Home
                                <Switch
                                    checked={m.homeTabView}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleHomeTab(m)}
                                />

                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditMarket({
                                            ...m,
                                            category: Array.isArray(m.category) ? m.category : []
                                        });
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>

                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMarket(m.id);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>

                            </Box>
                        </Box>


                    </Accordion>
                ))}

                {/* ADD DIALOG */}

                <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "primary.main", color: "#fff", px: 2, py: 1.5 }}>
                        <Typography>Add Market</Typography>
                        <IconButton onClick={() => setOpenAdd(false)} sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <DialogContent>

                        <TextField
                            label="Title"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={newMarket.title}
                            onChange={(e) => setNewMarket({ ...newMarket, title: e.target.value })}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ mt: 2 }}
                            value={newMarket.description}
                            onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                        />

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Add Category"
                                fullWidth
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // ✅ ADD THIS
                                        addCategory(editCategoryInput, true);
                                    }
                                }}
                            />

                            <Box sx={{ mt: 1 }}>
                                {categories.map((c, i) => (
                                    <Chip key={i} label={c} onClick={() => addCategory(c)} sx={{ mr: 1 }} />
                                ))}
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                {newMarket.category.map((c, i) => (
                                    <Chip key={i} label={c} onDelete={() => removeCategory(c)} sx={{ mr: 1 }} />
                                ))}
                            </Box>
                        </Box>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                        <Button variant="contained" onClick={addMarket}>Save</Button>
                    </DialogActions>

                </Dialog>

                {/* EDIT DIALOG */}

                <Dialog open={Boolean(editMarket)} onClose={() => setEditMarket(null)}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "primary.main", color: "#fff", px: 2, py: 1.5 }}>
                        <Typography>Edit Market</Typography>
                        <IconButton onClick={() => setEditMarket(null)} sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <DialogContent>

                        <TextField
                            label="Title"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={editMarket?.title || ""}
                            onChange={(e) => setEditMarket({ ...editMarket, title: e.target.value })}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ mt: 2 }}
                            value={editMarket?.description || ""}
                            onChange={(e) => setEditMarket({ ...editMarket, description: e.target.value })}
                        />

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Add Category"
                                fullWidth
                                value={editCategoryInput}
                                onChange={(e) => setEditCategoryInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addCategory(editCategoryInput, true);
                                }}
                            />

                            <Box sx={{ mt: 1 }}>
                                {categories.map((c, i) => (
                                    <Chip key={i} label={c} onClick={() => addCategory(c, true)} sx={{ mr: 1 }} />
                                ))}
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                {editMarket?.category?.map((c, i) => (
                                    <Chip key={i} label={c} onDelete={() => removeCategory(c, true)} sx={{ mr: 1 }} />
                                ))}
                            </Box>
                        </Box>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setEditMarket(null)}>Cancel</Button>
                        <Button variant="contained" onClick={updateMarket}>Update</Button>
                    </DialogActions>

                </Dialog>

            </div>
        </>
    );
}