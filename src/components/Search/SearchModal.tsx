import { useEffect, useRef, type ReactElement } from "react";
import { Dialog, DialogContent, InputBase, Box, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { SxProps, Theme } from "@mui/material";
import TypeFilterButtons from "@/components/Search/TypeFilterButtons";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import type { PokemonListResult } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const shakeKeyframe = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  .shake {
    animation: shake 0.5s ease;
  }
`;

const searchModalStyles: Record<string, SxProps<Theme>> = {
  dialog: {
    "& .MuiDialog-paper": (theme: Theme) => ({
      borderRadius: theme.shape.radius.extraSmall,
      width: "100%",
      maxWidth: theme.spacing(70),
      m: 2,
    }),
  },
  inputContainer: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 1.5,
    borderBottom: `1px solid ${theme.palette.divider}`,
  }),
  input: (theme: Theme) => ({
    ...theme.typography.body1,
    flex: 1,
    color: theme.palette.text.primary,
  }),
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    px: 2,
    py: 2,
  },
  label: (theme: Theme) => ({
    color: theme.palette.text.secondary,
  }),
  warning: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: theme.palette.warning.main,
    py: 0.5,
  }),
};

const SearchModal = ({ open, onClose }: SearchModalProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  // use cached data for instant search results — no need to wait for loading state
  const cachedPokemons =
    queryClient.getQueryData<PokemonListResult>(QUERY_KEYS.POKEMON_LIST)?.pokemons ?? [];

  const { search, activeType, isEmpty, isTyping, handleSearchChange, handleTypeChange } =
    useSearchFilter(cachedPokemons);

  // focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const prevIsEmptyRef = useRef(false);

  // shake only when isEmpty transitions false → true
  useEffect(() => {
    const el = warningRef.current;
    const justBecameEmpty = isEmpty && !prevIsEmptyRef.current;

    prevIsEmptyRef.current = isEmpty;

    if (!el || !justBecameEmpty) return;

    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }, [isEmpty]);

  const showWarning = isEmpty && !isTyping;

  const handleClear = () => {
    handleSearchChange("");
    handleTypeChange("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isEmpty) {
      onClose();
    }
  };

  return (
    <>
      <style>{shakeKeyframe}</style>
      <Dialog
        open={open}
        onClose={onClose}
        sx={searchModalStyles.dialog}
        aria-label="Search Pokémon"
      >
        <Box sx={searchModalStyles.inputContainer}>
          <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <InputBase
            inputRef={inputRef}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Pokémon by name..."
            sx={searchModalStyles.input}
            inputProps={{ "aria-label": "Search Pokémon by name" }}
          />
          <IconButton size="small" onClick={handleClear} aria-label="Clear search and close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={searchModalStyles.content}>
          {showWarning && (
            <Box ref={warningRef} sx={searchModalStyles.warning} role="alert" aria-live="polite">
              <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                No Pokémon found — try a different name or type
              </Typography>
            </Box>
          )}

          <Typography variant="caption" sx={searchModalStyles.label}>
            Filter by type
          </Typography>
          <TypeFilterButtons
            activeType={activeType}
            onTypeChange={(type) => {
              handleTypeChange(type);
              onClose();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchModal;
