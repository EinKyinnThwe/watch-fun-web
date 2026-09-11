export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    name?: string; // present on some TV-shaped results from search
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids?: number[];
    adult?: boolean;
    original_language?: string;
    popularity?: number;
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface CastMember {
    id: number;
    cast_id: number;
    credit_id: string;
    character: string;
    name: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    credit_id: string;
    job: string;
    department: string;
    name: string;
    profile_path: string | null;
}

export interface MovieCredits {
    id: number;
    cast: CastMember[];
    crew: CrewMember[];
}

export interface MovieVideo {
    id: string;
    key: string;
    name: string;
    site: string; // "YouTube"
    type: string; // "Trailer" | "Teaser" | ...
}

export interface MovieDetails extends Movie {
    tagline: string;
    runtime: number | null;
    genres: Genre[];
    production_companies: ProductionCompany[];
    budget: number;
    revenue: number;
    status: string;
    credits?: MovieCredits;
    videos?: { results: MovieVideo[] };
    similar?: TMDBResponse<Movie>;
    recommendations?: TMDBResponse<Movie>;
}

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface GenreListResponse {
    genres: Genre[];
}

export interface MultiSearchItem {
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    title?: string;
    name?: string;
    poster_path?: string | null;
    profile_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
    vote_average?: number;
    genre_ids?: number[];
    known_for_department?: string;
}

export interface FavoriteMovie {
    id?: string;
    movieId: number;
    title: string; // or 'title' if you standardize it
    poster_path: string | null;
    backdrop_path?: string | null;
    vote_average?: number | null;
    addedAt?: any;
}
