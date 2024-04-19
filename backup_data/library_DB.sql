PGDMP     +    /                |            library    15.4    15.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    library    DATABASE     z   CREATE DATABASE library WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1250';
    DROP DATABASE library;
                postgres    false            �            1259    16399    books    TABLE     3  CREATE TABLE public.books (
    book_id integer NOT NULL,
    cover character varying(150),
    isbn character varying(30),
    read_date date,
    recomend integer,
    shop_link character varying(150),
    entry text,
    notes text,
    title character varying(150),
    author character varying(150)
);
    DROP TABLE public.books;
       public         heap    postgres    false            �            1259    16404    books_id_seq    SEQUENCE     �   CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.books_id_seq;
       public          postgres    false    214            �           0    0    books_id_seq    SEQUENCE OWNED BY     B   ALTER SEQUENCE public.books_id_seq OWNED BY public.books.book_id;
          public          postgres    false    215            e           2604    16405    books book_id    DEFAULT     i   ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_id_seq'::regclass);
 <   ALTER TABLE public.books ALTER COLUMN book_id DROP DEFAULT;
       public          postgres    false    215    214            �          0    16399    books 
   TABLE DATA           r   COPY public.books (book_id, cover, isbn, read_date, recomend, shop_link, entry, notes, title, author) FROM stdin;
    public          postgres    false    214   <       �           0    0    books_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.books_id_seq', 9, true);
          public          postgres    false    215            g           2606    16407    books books_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public            postgres    false    214            �   �  x���Oj�0���)��w[�(%3�$5�*��l+�l�2���^J�r�Y��̈́&$%a
BB����"�ֽ:u�B�dR9�g]�sI��Y���U޹I�~F�x�:u_�7�0�3<�~I}7�(��7G������V��b�ס{b�q�K��u`'IE��䚋�K�F�?ss!�cbs+H�VT���;Zw�w��mCO��+�QS#כy{&�g�S�@�it�m`�-�͙v�`~4=����VKZ���j������>���:�껇��9�b�I�v`%��V�������������X�	��7��C�̰b���8�����8� �*����v���ϑ�Ϡ�C-9�&I�=��+�W�P���%�B{yx@�$���{vg�d+��i��mwX��ҵu�X����     